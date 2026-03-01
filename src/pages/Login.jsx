import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, KeyRound, X, Save } from "lucide-react";

const LS_AUTH = "bulktrack_auth";
const LS_PIN = "bulktrack_pin";

function getPin() {
  const p = localStorage.getItem(LS_PIN);
  return p && p.length >= 4 ? p : "1234";
}

export default function Login({ onAuthed }) {
  const nav = useNavigate();

  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  // pin change modal
  const [open, setOpen] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPin2, setNewPin2] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [pinOk, setPinOk] = useState("");

  const currentPin = useMemo(() => getPin(), []); // modal açılınca güncelsin

  const submit = (e) => {
    e.preventDefault();
    const ok = pin === getPin();

    if (!ok) {
      setErr("PIN yanlış");
      return;
    }

    localStorage.setItem(LS_AUTH, "1");
    onAuthed?.(true);
    nav("/dashboard", { replace: true });
  };

  const openModal = () => {
    setOpen(true);
    setOldPin("");
    setNewPin("");
    setNewPin2("");
    setPinErr("");
    setPinOk("");
  };

  const closeModal = () => {
    setOpen(false);
    setPinErr("");
    setPinOk("");
  };

  const savePin = () => {
    setPinErr("");
    setPinOk("");

    const cur = getPin();

    if (oldPin !== cur) return setPinErr("Eski PIN yanlış");
    if (!/^\d{4,}$/.test(newPin)) return setPinErr("Yeni PIN en az 4 rakam olmalı");
    if (newPin !== newPin2) return setPinErr("Yeni PIN'ler aynı değil");
    if (newPin === cur) return setPinErr("Yeni PIN eskiyle aynı olamaz");

    localStorage.setItem(LS_PIN, newPin);
    setPinOk("PIN güncellendi ✅");
    setTimeout(() => closeModal(), 700);
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.brand}>BulkTrack</div>
        <div style={styles.sub}>Premium disiplin paneli</div>

        <form onSubmit={submit} style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div style={styles.inputWrap}>
            <Lock size={18} />
            <input
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/[^\d]/g, ""));
                setErr("");
              }}
              placeholder="PIN"
              inputMode="numeric"
              style={styles.input}
              maxLength={10}
            />
          </div>

          {err ? <div style={styles.err}>{err}</div> : null}

          <button type="submit" style={styles.btn}>
            <LogIn size={18} />
            Giriş Yap
          </button>

          <div style={styles.row}>
            <button type="button" onClick={openModal} style={styles.linkBtn}>
              <KeyRound size={16} />
              PIN Değiştir
            </button>

            <div style={styles.hint}>
              Varsayılan: <b>1234</b>
            </div>
          </div>
        </form>
      </div>

      {/* Modal */}
      {open && (
        <div style={styles.overlay} onMouseDown={closeModal}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalTop}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <KeyRound size={18} />
                <div style={{ fontWeight: 900 }}>PIN Değiştir</div>
              </div>

              <button onClick={closeModal} style={styles.iconBtn} title="Kapat">
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalSub}>
              Mevcut PIN: <b>{currentPin}</b> (sadece geliştirme için gösteriyoruz)
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <Field
                label="Eski PIN"
                value={oldPin}
                setValue={setOldPin}
                placeholder="Eski PIN"
              />
              <Field
                label="Yeni PIN"
                value={newPin}
                setValue={setNewPin}
                placeholder="Yeni PIN (min 4)"
              />
              <Field
                label="Yeni PIN (Tekrar)"
                value={newPin2}
                setValue={setNewPin2}
                placeholder="Yeni PIN tekrar"
              />

              {pinErr ? <div style={styles.err}>{pinErr}</div> : null}
              {pinOk ? <div style={styles.ok}>{pinOk}</div> : null}

              <button type="button" onClick={savePin} style={styles.btn2}>
                <Save size={18} />
                Kaydet
              </button>

              <div style={styles.tiny}>
                V1’de PIN localStorage’da. Sonra gerçek auth’a geçeceğiz.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, setValue, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{label}</div>
      <div style={styles.inputWrap}>
        <Lock size={18} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={placeholder}
          inputMode="numeric"
          style={styles.input}
          maxLength={10}
        />
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    background:
      "radial-gradient(1000px 600px at 10% 0%, rgba(124,58,237,0.22), transparent 60%), radial-gradient(1000px 600px at 90% 10%, rgba(57,255,136,0.12), transparent 55%), #0b0f16",
    color: "rgba(255,255,255,0.92)",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },
  card: {
    width: "min(440px, 100%)",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  brand: { fontWeight: 900, fontSize: 22, letterSpacing: 0.2 },
  sub: { fontSize: 12, opacity: 0.78, marginTop: 4 },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
  },

  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(57,255,136,0.22)",
    background:
      "linear-gradient(180deg, rgba(57,255,136,0.18), rgba(124,58,237,0.10))",
    color: "rgba(255,255,255,0.95)",
    fontWeight: 900,
    cursor: "pointer",
  },

  row: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  linkBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.12)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },
  hint: { fontSize: 12, opacity: 0.75 },

  err: {
    fontSize: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,80,80,0.25)",
    background: "rgba(255,80,80,0.10)",
  },
  ok: {
    fontSize: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(57,255,136,0.25)",
    background: "rgba(57,255,136,0.10)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 999,
  },
  modal: {
    width: "min(520px, 100%)",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,22,36,0.96)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
    padding: 14,
  },
  modalTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modalSub: { marginTop: 8, fontSize: 12, opacity: 0.78 },
  iconBtn: {
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.18)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
  },
  btn2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(167,139,250,0.25)",
    background:
      "linear-gradient(180deg, rgba(124,58,237,0.20), rgba(57,255,136,0.10))",
    color: "rgba(255,255,255,0.95)",
    fontWeight: 900,
    cursor: "pointer",
  },
  tiny: { fontSize: 12, opacity: 0.7, textAlign: "center" },
};