import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { changeDisplayName, changePassword, deleteAccount } from '../api/authApi'
import '../styles/account.css'

function AccountPage() {
  const { user, displayName, logout, updateDisplayName } = useAuth()
  const navigate = useNavigate()

  const [newDisplayName, setNewDisplayName] = useState('')
  const [displayNameMsg, setDisplayNameMsg] = useState(null)
  const [displayNameError, setDisplayNameError] = useState(null)
  const [displayNameLoading, setDisplayNameLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleChangeDisplayName = async (e) => {
    e.preventDefault()
    setDisplayNameMsg(null)
    setDisplayNameError(null)
    const trimmed = newDisplayName.trim()
    if (!trimmed) {
      setDisplayNameError('Display name cannot be empty.')
      return
    }
    setDisplayNameLoading(true)
    try {
      const res = await changeDisplayName(user, trimmed)
      updateDisplayName(res.display_name)
      setNewDisplayName('')
      setDisplayNameMsg('Display name updated successfully.')
    } catch (err) {
      setDisplayNameError(err.message)
    } finally {
      setDisplayNameLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMsg(null)
    setPasswordError(null)
    if (!currentPassword) {
      setPasswordError('Current password is required.')
      return
    }
    if (!newPassword) {
      setPasswordError('New password is required.')
      return
    }
    setPasswordLoading(true)
    try {
      await changePassword(user, currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPasswordMsg('Password updated successfully.')
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleteError(null)
    if (!deletePassword) {
      setDeleteError('Password is required to delete your account.')
      return
    }
    setDeleteLoading(true)
    try {
      await deleteAccount(user, deletePassword)
      logout()
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
      setConfirmDelete(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="page account-page">
      <h1>Account Settings</h1>
      <p className="account-subtitle">
        Logged in as <strong>{user}</strong>
        {displayName !== user && <span> · displayed as <strong>{displayName}</strong></span>}
      </p>

      <section className="account-section">
        <h2>Change Display Name</h2>
        <p className="account-section-note">
          This is the name shown in the app. Your login username (<strong>{user}</strong>) cannot be changed.
        </p>
        <form onSubmit={handleChangeDisplayName} className="account-field-row">
          <input
            type="text"
            placeholder={displayName}
            value={newDisplayName}
            onChange={e => setNewDisplayName(e.target.value)}
          />
          <button type="submit" disabled={displayNameLoading}>
            {displayNameLoading ? 'Saving…' : 'Confirm'}
          </button>
        </form>
        {displayNameError && <p className="error">{displayNameError}</p>}
        {displayNameMsg && <p className="success">{displayNameMsg}</p>}
      </section>

      <section className="account-section">
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword} className="account-password-form">
          <div className="account-field-row">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="account-field-row">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={passwordLoading}>
              {passwordLoading ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        </form>
        {passwordError && <p className="error">{passwordError}</p>}
        {passwordMsg && <p className="success">{passwordMsg}</p>}
      </section>

      <section className="account-section account-danger-zone">
        <h2>Danger Zone</h2>
        <div className="account-danger-buttons">
          <div className="account-danger-item">
            <div className="account-danger-info">
              <strong>Terminate Account</strong>
              <span>Permanently deletes your account and all data. This cannot be undone.</span>
            </div>
            <div className="account-danger-delete">
              {confirmDelete && (
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                />
              )}
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : confirmDelete ? 'Confirm Delete' : 'Terminate Account'}
              </button>
            </div>
          </div>
          {deleteError && <p className="error">{deleteError}</p>}
          {confirmDelete && !deleteLoading && (
            <p className="account-danger-warning">
              This will permanently delete your account. Enter your password and click Confirm Delete.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default AccountPage
