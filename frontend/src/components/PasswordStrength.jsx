import React from 'react'


function scorePassword(p) {
let score = 0
if (!p) return 0
if (p.length >= 8) score += 2
if (/[A-Z]/.test(p)) score += 1
if (/[0-9]/.test(p)) score += 1
if (/[^A-Za-z0-9]/.test(p)) score += 1
return score // 0..5
}


export default function PasswordStrength({ password }) {
const score = scorePassword(password)
const pct = Math.round((score / 5) * 100)
const status = score >= 4 ? 'Strong' : score >= 2 ? 'Medium' : 'Weak'
return (
<div className="pw-wrapper">
<div className="pw-bar">
<div className="pw-fill" style={{ width: `${pct}%` }} />
</div>
<div className="pw-text">{password ? status : ''}</div>
</div>
)
}