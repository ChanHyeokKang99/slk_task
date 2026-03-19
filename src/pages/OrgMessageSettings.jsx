import { useState, useEffect } from "react";
import { currentOrg, savedKeys as mockSavedKeys, providerConfig } from "../data/mockData";

// ── 유틸 ──────────────────────────────────────────────
const maskValue = (val = "") => {
  if (val.length <= 8) return "●".repeat(Math.max(val.length, 8));
  return val.slice(0, 4) + "●".repeat(val.length - 8) + val.slice(-4);
};

const validateField = (field, value) => {
  const v = value.trim();
  if (field.required && !v) return `${field.label}을(를) 입력해주세요.`;
  if (!v) return null;
  if (field.prefix && !v.startsWith(field.prefix))
    return `'${field.prefix}'로 시작해야 합니다. (예: ${field.placeholder})`;
  if (field.minLength && v.length < field.minLength)
    return `${field.minLength}자 이상 입력해주세요. (현재 ${v.length}자)`;
  if (field.pattern && !field.pattern.test(v))
    return field.patternMsg;
  return null;
};

const STEPS = ["업체 선택", "키 입력", "연동 테스트"];

// ── 메인 ──────────────────────────────────────────────
export default function OrgMessageSettings() {
  const [step, setStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState(currentOrg.messageProvider);
  const [pendingProvider, setPendingProvider] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [revealed, setRevealed] = useState({});
  const [revealTimers, setRevealTimers] = useState({});
  const [testStatus, setTestStatus] = useState("idle");
  const [testErrCode, setTestErrCode] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const provider = selectedProvider ? providerConfig[selectedProvider] : null;
  const isCurrentProvider = selectedProvider === currentOrg.messageProvider;

  // 업체 선택 시 저장된 키 로드
  useEffect(() => {
    if (!selectedProvider) return;
    setFormValues(isCurrentProvider ? { ...mockSavedKeys } : {});
    setFieldErrors({});
    setTouched({});
    setTestStatus("idle");
    setTestErrCode(null);
  }, [selectedProvider]);

  // 폼 변경 시 테스트 리셋
  useEffect(() => {
    if (testStatus === "success") setTestStatus("idle");
  }, [formValues]);

  // ── 핸들러 ──────────────────────────────────────────
  const handleSelectProvider = (key) => {
    if (key === selectedProvider) { setStep(1); return; }
    if (currentOrg.apiConfigured) {
      setPendingProvider(key);
      setShowChangeModal(true);
    } else {
      setSelectedProvider(key);
      setStep(1);
    }
  };

  const confirmChange = () => {
    setSelectedProvider(pendingProvider);
    setPendingProvider(null);
    setShowChangeModal(false);
    setStep(1);
  };

  const handleChange = (key, value) => {
    setFormValues((p) => ({ ...p, [key]: value }));
    if (touched[key]) {
      const field = provider.fields.find((f) => f.key === key);
      setFieldErrors((p) => ({ ...p, [key]: validateField(field, value) }));
    }
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field.key]: true }));
    setFieldErrors((p) => ({ ...p, [field.key]: validateField(field, formValues[field.key] || "") }));
  };

  const toggleReveal = (key) => {
    if (revealTimers[key]) clearTimeout(revealTimers[key]);
    if (revealed[key]) { setRevealed((p) => ({ ...p, [key]: false })); return; }
    setRevealed((p) => ({ ...p, [key]: true }));
    const t = setTimeout(() => setRevealed((p) => ({ ...p, [key]: false })), 4000);
    setRevealTimers((p) => ({ ...p, [key]: t }));
  };

  const validateAll = () => {
    const errs = {};
    provider.fields.forEach((f) => {
      const e = validateField(f, formValues[f.key] || "");
      if (e) errs[f.key] = e;
    });
    setFieldErrors(errs);
    setTouched(Object.fromEntries(provider.fields.map((f) => [f.key, true])));
    return Object.keys(errs).length === 0;
  };

  const handleNextToTest = () => { if (validateAll()) setStep(2); };

  const handleTest = () => {
    setTestStatus("loading");
    setTestErrCode(null);
    setTimeout(() => {
      const key = formValues["apiKey"] || "";
      if (key.includes("invalid") || key.includes("fail")) {
        setTestStatus("fail");
        setTestErrCode("AUTH_401");
      } else {
        setTestStatus("success");
      }
    }, 2000);
  };

  const handleSave = () => {
    showToast("✅ 설정이 저장되었습니다.");
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const allFilled = provider?.fields.every((f) => (formValues[f.key] || "").trim());
  const hasErrors = Object.values(fieldErrors).some(Boolean);

  return (
    <div className="page-wrap" style={s.page}>
      <div className="page-header-row" style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>문자 발송 업체 설정</h1>
          <p style={s.pageDesc}>발송에 사용할 업체와 API 키를 설정합니다.</p>
        </div>
        <CurrentStatusPill org={currentOrg} />
      </div>

      <StepBar steps={STEPS} current={step} onStepClick={(i) => { if (i < step) setStep(i); }} />

      {step === 0 && (
        <ProviderStep
          selectedProvider={selectedProvider}
          currentProvider={currentOrg.messageProvider}
          onSelect={handleSelectProvider}
        />
      )}

      {step === 1 && provider && (
        <KeyInputStep
          provider={provider}
          formValues={formValues}
          fieldErrors={fieldErrors}
          touched={touched}
          revealed={revealed}
          isCurrentProvider={isCurrentProvider}
          onChange={handleChange}
          onBlur={handleBlur}
          onToggleReveal={toggleReveal}
          onBack={() => setStep(0)}
          onNext={handleNextToTest}
          allFilled={allFilled}
          hasErrors={hasErrors}
        />
      )}

      {step === 2 && provider && (
        <TestStep
          provider={provider}
          formValues={formValues}
          testStatus={testStatus}
          testErrCode={testErrCode}
          onBack={() => setStep(1)}
          onTest={handleTest}
          onSave={handleSave}
        />
      )}

      {showChangeModal && (
        <ChangeModal
          from={providerConfig[currentOrg.messageProvider]}
          to={providerConfig[pendingProvider]}
          pendingCount={currentOrg.pendingMessages}
          onCancel={() => setShowChangeModal(false)}
          onConfirm={confirmChange}
        />
      )}

      {toastMsg && <Toast msg={toastMsg} />}
    </div>
  );
}

// ── 서브 컴포넌트 ──────────────────────────────────────

function CurrentStatusPill({ org }) {
  if (!org.apiConfigured) {
    return <div style={{ ...s.pill, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>⚠ 미설정</div>;
  }
  const p = providerConfig[org.messageProvider];
  return (
    <div style={{ ...s.pill, background: "#F0FDF4", border: "1px solid #86EFAC", color: "#16A34A" }}>
      <span style={s.pillDot} />{p.icon} {p.name} 연동 중
    </div>
  );
}

function StepBar({ steps, current, onStepClick }) {
  return (
    <div className="step-bar">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={s.stepItem} onClick={() => done && onStepClick(i)}>
            <div style={{
              ...s.stepCircle,
              background: done || active ? "#3B82F6" : "#E2E8F0",
              color: done || active ? "#fff" : "#94A3B8",
              boxShadow: active ? "0 0 0 4px #DBEAFE" : "none",
              cursor: done ? "pointer" : "default",
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span className="step-label-text" style={{ ...s.stepLabel, color: active ? "#1D4ED8" : done ? "#3B82F6" : "#94A3B8", fontWeight: active ? 700 : 400 }}>
              {label}
            </span>
            {i < steps.length - 1 && <div className="step-line" style={{ background: done ? "#3B82F6" : "#E2E8F0" }} />}
          </div>
        );
      })}
    </div>
  );
}

function ProviderStep({ selectedProvider, currentProvider, onSelect }) {
  return (
    <div style={s.card}>
      <p style={s.cardDesc}>사용할 문자 발송 업체를 선택하세요. 업체마다 필요한 API 키 항목이 다릅니다.</p>
      <div className="provider-grid">
        {Object.entries(providerConfig).map(([key, cfg]) => {
          const isSelected = selectedProvider === key;
          const isCurrent = currentProvider === key;
          return (
            <button
              key={key}
              style={{
                ...s.providerCard,
                borderColor: isSelected ? cfg.color : "#E2E8F0",
                background: isSelected ? cfg.color + "0D" : "#FAFAFA",
              }}
              onClick={() => onSelect(key)}
            >
              {isCurrent && <span style={s.currentTag}>현재 사용 중</span>}
              <div style={s.providerEmoji}>{cfg.icon}</div>
              <div style={s.providerCardName}>{cfg.name}</div>
              <div style={s.providerCardDesc}>{cfg.description}</div>
              <div style={{ ...s.providerPill, background: isSelected ? cfg.color : "#E2E8F0", color: isSelected ? "#fff" : "#64748B" }}>
                {isSelected ? "✓ 선택됨" : "선택하기"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function KeyInputStep({ provider, formValues, fieldErrors, touched, revealed, isCurrentProvider, onChange, onBlur, onToggleReveal, onBack, onNext, allFilled, hasErrors }) {
  return (
    <div style={s.card}>
      <div style={s.cardTop}>
        <span style={s.cardTopIcon}>{provider.icon}</span>
        <span style={s.cardTopTitle}>{provider.name} API 키 입력</span>
        <a href={provider.docsUrl} target="_blank" rel="noreferrer" style={s.docsLink}>공식 문서 →</a>
      </div>

      {isCurrentProvider && (
        <div style={s.savedBanner}>
          🔒 저장된 키가 있습니다. 변경하려면 해당 필드를 직접 수정하세요.
        </div>
      )}

      <div style={s.form}>
        {provider.fields.map((field) => {
          const val = formValues[field.key] || "";
          const err = touched[field.key] ? fieldErrors[field.key] : null;
          const ok = touched[field.key] && !fieldErrors[field.key] && val.trim();
          const isRevealed = revealed[field.key];
          const showMasked = isCurrentProvider && mockSavedKeys[field.key] && !val;

          return (
            <div key={field.key} style={s.fieldWrap}>
              <label style={s.label}>
                {field.label}{field.required && <span style={s.req}> *</span>}
              </label>
              <div style={{ ...s.inputBox, borderColor: err ? "#EF4444" : ok ? "#22C55E" : "#E2E8F0", boxShadow: err ? "0 0 0 3px #FEE2E2" : ok ? "0 0 0 3px #DCFCE7" : "none" }}>
                <input
                  style={s.input}
                  type={field.secret && !isRevealed ? "password" : "text"}
                  placeholder={showMasked ? maskValue(mockSavedKeys[field.key]) : field.placeholder}
                  value={val}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  onBlur={() => onBlur(field)}
                />
                {field.secret && val && (
                  <button style={s.eyeBtn} type="button" onClick={() => onToggleReveal(field.key)} title={isRevealed ? "숨기기" : "4초간 표시"}>
                    {isRevealed ? "🙈" : "👁"}
                  </button>
                )}
                {ok && <span style={s.okMark}>✓</span>}
              </div>
              {err
                ? <div style={s.errMsg}><span>⚠</span> {err}</div>
                : <div style={s.hintMsg}>
                    ℹ {field.hint}
                    {field.secret && isRevealed && <span style={{ color: "#F59E0B" }}> · 4초 후 자동으로 가려집니다</span>}
                  </div>
              }
            </div>
          );
        })}
      </div>

      <div className="step-actions">
        <button style={s.ghostBtn} onClick={onBack}>← 업체 다시 선택</button>
        <button
          style={{ ...s.primaryBtn, opacity: allFilled && !hasErrors ? 1 : 0.45, cursor: allFilled && !hasErrors ? "pointer" : "not-allowed" }}
          onClick={onNext}
          disabled={!allFilled || hasErrors}
        >
          연동 테스트로 이동 →
        </button>
      </div>
      {!allFilled && <p style={s.bottomNote}>모든 필드를 입력해야 다음 단계로 이동할 수 있습니다.</p>}
    </div>
  );
}

const errGuides = {
  AUTH_401: {
    title: "API Key 인증에 실패했습니다.",
    items: [
      "키를 복사할 때 앞뒤 공백이 포함되지 않았는지 확인하세요.",
      "키가 만료되었거나 비활성화 상태일 수 있습니다. 업체 콘솔에서 상태를 확인하세요.",
      "테스트(test) 키와 라이브(live) 키를 혼용하지 않았는지 확인하세요.",
    ],
  },
};

function TestStep({ provider, formValues, testStatus, testErrCode, onBack, onTest, onSave }) {
  const guide = testErrCode ? errGuides[testErrCode] : null;

  return (
    <div style={s.card}>
      <div style={s.cardTop}>
        <span style={s.cardTopIcon}>{provider.icon}</span>
        <span style={s.cardTopTitle}>연동 테스트</span>
      </div>

      {/* 입력값 요약 */}
      <div style={s.summary}>
        <div style={s.summaryHead}>입력한 설정 확인</div>
        {provider.fields.map((f) => (
          <div key={f.key} style={s.summaryRow}>
            <span style={s.summaryKey}>{f.label}</span>
            <span style={s.summaryVal}>
              {f.secret ? maskValue(formValues[f.key] || "") : (formValues[f.key] || "—")}
            </span>
          </div>
        ))}
        <button style={s.editBtn} onClick={onBack}>수정하기 →</button>
      </div>

      {/* 테스트 영역 */}
      {testStatus === "idle" && (
        <div style={s.testCenter}>
          <div style={{ fontSize: 40 }}>🔌</div>
          <p style={s.testCenterText}>실제 API 호출로 연결을 확인합니다.<br />저장 전 반드시 테스트를 완료해야 합니다.</p>
          <button style={{ ...s.primaryBtn, padding: "13px 36px", fontSize: 15 }} onClick={onTest}>
            연동 테스트 실행
          </button>
        </div>
      )}

      {testStatus === "loading" && (
        <div style={s.testCenter}>
          <div style={s.spinner} />
          <p style={s.testCenterText}>업체 서버에 연결 중입니다...</p>
        </div>
      )}

      {testStatus === "success" && (
        <div style={{ ...s.resultBox, background: "#F0FDF4", border: "1px solid #86EFAC" }}>
          <div style={{ fontSize: 44 }}>✅</div>
          <div style={{ ...s.resultTitle, color: "#166534" }}>연동 테스트 성공</div>
          <p style={{ ...s.resultDesc, color: "#166534" }}>
            {provider.name} API와 정상 연결되었습니다.<br />이제 설정을 저장할 수 있습니다.
          </p>
          <button style={{ ...s.primaryBtn, background: "#16A34A", padding: "13px 36px", fontSize: 15 }} onClick={onSave}>
            설정 저장하기
          </button>
          <button style={{ ...s.ghostBtn, marginTop: 6, fontSize: 13 }} onClick={onTest}>다시 테스트</button>
        </div>
      )}

      {testStatus === "fail" && guide && (
        <div style={{ ...s.resultBox, background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <div style={{ fontSize: 44 }}>❌</div>
          <div style={{ ...s.resultTitle, color: "#DC2626" }}>연동 테스트 실패</div>
          <p style={{ ...s.resultDesc, color: "#991B1B" }}>{guide.title}</p>
          <div style={s.guideBox}>
            <div style={s.guideHead}>해결 방법</div>
            {guide.items.map((item, i) => (
              <div key={i} style={s.guideRow}>
                <span style={s.guideNum}>{i + 1}</span>
                <span style={{ fontSize: 13, color: "#7F1D1D" }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={s.errCodeRow}>에러 코드: <code style={s.errCode}>{testErrCode}</code></div>
          <div className="fail-actions">
            <button style={s.ghostBtn} onClick={onBack}>← 키 수정하기</button>
            <button style={{ ...s.primaryBtn, background: "#EF4444" }} onClick={onTest}>다시 테스트</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeModal({ from, to, pendingCount, onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" style={s.overlay}>
      <div className="modal-box" style={s.modal}>
        <div style={s.modalBanner}>⚠ 업체 변경 전 확인하세요</div>
        <div style={s.modalBody}>
          <div style={s.changeRow}>
            <span style={s.changeChip}>{from.icon} {from.name}</span>
            <span style={{ color: "#94A3B8", fontSize: 18 }}>→</span>
            <span style={s.changeChip}>{to.icon} {to.name}</span>
          </div>
          <div style={s.modalItems}>
            {pendingCount > 0 && (
              <div style={{ ...s.modalItem, background: "#FFFBEB", borderColor: "#FDE68A" }}>
                <span>⏳</span>
                <span>대기 중인 메시지 <strong>{pendingCount}건</strong>은 기존 업체({from.name})로 발송됩니다.</span>
              </div>
            )}
            <div style={s.modalItem}>
              <span>🔄</span>
              <span>변경 후 신규 메시지부터 <strong>{to.name}</strong>이 적용됩니다.</span>
            </div>
            <div style={s.modalItem}>
              <span>🗑</span>
              <span>기존 API 키 설정이 <strong>모두 초기화</strong>됩니다.</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={s.ghostBtn} onClick={onCancel}>취소</button>
            <button style={{ ...s.primaryBtn, background: "#EF4444" }} onClick={onConfirm}>변경 진행</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg }) {
  return <div style={s.toast}>{msg}</div>;
}

// ── 스타일 ────────────────────────────────────────────

const s = {
  page: { maxWidth: 660 },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#0F172A", margin: 0 },
  pageDesc: { fontSize: 13, color: "#64748B", margin: "4px 0 0" },
  pill: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20 },
  pillDot: { width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" },

  stepBar: { display: "flex", alignItems: "center", marginBottom: 28, overflowX: "auto" },
  stepItem: { display: "flex", alignItems: "center", gap: 8 },
  stepCircle: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, transition: "all 0.2s" },
  stepLabel: { fontSize: 13, whiteSpace: "nowrap" },
  stepLine: { width: 36, height: 2, margin: "0 4px", transition: "background 0.2s" },

  card: { background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  cardDesc: { fontSize: 14, color: "#64748B", margin: "0 0 20px" },
  cardTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" },
  cardTopIcon: { fontSize: 20 },
  cardTopTitle: { fontSize: 16, fontWeight: 700, color: "#0F172A", flex: 1 },
  docsLink: { fontSize: 12, color: "#3B82F6", textDecoration: "none" },

  providerGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }, // fallback (CSS class overrides on mobile)
  providerCard: { border: "2px solid", borderRadius: 12, padding: 20, cursor: "pointer", textAlign: "left", position: "relative", transition: "all 0.15s" },
  currentTag: { position: "absolute", top: 10, right: 10, background: "#DBEAFE", color: "#1D4ED8", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 },
  providerEmoji: { fontSize: 28, marginBottom: 8 },
  providerCardName: { fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 },
  providerCardDesc: { fontSize: 12, color: "#94A3B8", marginBottom: 14 },
  providerPill: { display: "inline-block", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 },

  savedBanner: { background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#92400E", marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 22 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  req: { color: "#EF4444" },
  inputBox: { display: "flex", alignItems: "center", border: "1.5px solid", borderRadius: 8, overflow: "hidden", transition: "all 0.15s" },
  input: { flex: 1, padding: "11px 14px", border: "none", outline: "none", fontSize: 14, fontFamily: "monospace", color: "#0F172A", background: "transparent" },
  eyeBtn: { padding: "0 12px", border: "none", background: "none", cursor: "pointer", fontSize: 15, color: "#94A3B8", flexShrink: 0 },
  okMark: { paddingRight: 12, color: "#22C55E", fontWeight: 700, fontSize: 15, flexShrink: 0 },
  errMsg: { display: "flex", gap: 5, fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "6px 10px" },
  hintMsg: { fontSize: 12, color: "#94A3B8" },

  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid #F1F5F9", gap: 10 }, // used as fallback
  bottomNote: { textAlign: "center", fontSize: 12, color: "#94A3B8", margin: "10px 0 0" },

  summary: { background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 18px", marginBottom: 24 },
  summaryHead: { fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 },
  summaryRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9" },
  summaryKey: { fontSize: 13, color: "#64748B" },
  summaryVal: { fontSize: 13, fontFamily: "monospace", color: "#334155" },
  editBtn: { background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontSize: 12, padding: "8px 0 0", fontWeight: 500 },

  testCenter: { display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 0", gap: 14 },
  testCenterText: { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 1.7, margin: 0 },
  spinner: { width: 40, height: 40, border: "3px solid #E2E8F0", borderTop: "3px solid #3B82F6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  resultBox: { borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  resultTitle: { fontSize: 17, fontWeight: 700 },
  resultDesc: { fontSize: 14, textAlign: "center", lineHeight: 1.7, margin: 0 },
  guideBox: { background: "rgba(255,255,255,0.7)", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", width: "100%" },
  guideHead: { fontSize: 11, fontWeight: 700, color: "#991B1B", textTransform: "uppercase", marginBottom: 8 },
  guideRow: { display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" },
  guideNum: { background: "#FCA5A5", color: "#7F1D1D", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  errCodeRow: { fontSize: 11, color: "#94A3B8" },
  errCode: { background: "#F1F5F9", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace" },

  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal: { background: "#fff", borderRadius: 16, overflow: "hidden", maxWidth: 420, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" },
  modalBanner: { background: "#FEF3C7", padding: "12px 20px", fontSize: 14, fontWeight: 600, color: "#92400E", borderBottom: "1px solid #FDE68A" },
  modalBody: { padding: 24 },
  changeRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 },
  changeChip: { background: "#F1F5F9", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "#334155" },
  modalItems: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  modalItem: { display: "flex", gap: 10, alignItems: "flex-start", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#334155" },

  primaryBtn: { padding: "10px 22px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
  ghostBtn: { padding: "10px 18px", background: "#fff", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 },
  toast: { position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0F172A", color: "#fff", padding: "13px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 300, whiteSpace: "nowrap" },
};
