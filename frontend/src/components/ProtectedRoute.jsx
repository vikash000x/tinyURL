import React from 'react'


export default function ProtectedRoute({ children }) {
const user = JSON.parse(localStorage.getItem('user') || 'null')
if (!user) {
window.location.href = '/login'
return null
}
return children
}