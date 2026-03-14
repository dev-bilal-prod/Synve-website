<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontSize: 12, color: "#6e6e73", fontFamily: "var(--font-outfit)", letterSpacing: "0.04em" }}>
        WhatsApp Number *
    </label>
    <input
        required
        value={form.phone}
        onChange={e => {
            const val = e.target.value.replace(/[^\d+\s-]/g, "");
            if (val.length <= 16) setForm({ ...form, phone: val });
        }}
        placeholder="+1 234 567 8900"
        maxLength={16}
        style={{
            padding: "14px 18px", borderRadius: 12,
            border: "1.5px solid rgba(0,0,0,0.1)",
            fontSize: 15, fontFamily: "var(--font-outfit)",
            color: "#1d1d1f", background: "#f5f5f7", outline: "none",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "#0071e3"}
        onBlur={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
    />
    <p style={{ fontSize: 11, color: "#a1a1a6", fontFamily: "var(--font-outfit)" }}>
        Include country code e.g. +92 300 1234567 or +1 234 567 8900
    </p>
</div>