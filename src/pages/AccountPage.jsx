import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAuth } from '../hooks/userAuth'
import { changedName as apiChangedName, changePW as apiChangePW, deleteAcc as apiDeleteAcc } from '../api/authApi'
import '../styles/account.css'

function AccountPage() {
  const { user, displayName, logout, updateDisplayName } = userAuth()
  const navigate = useNavigate()

  const [dName, setdName] = useState('')
  const [dNameMessage, setdNameMessage] = useState(null)
  const [dNameError, setdNameError] = useState(null)
  const [dNameLoad, setdNameLoad] = useState(false)

  const [curPW, setCurPW] = useState('')
  const [newPW, setNewPW] = useState('')
  const [pwMessage, setPWMessage] = useState(null)
  const [pwError, setPWError] = useState(null)
  const [pwLoad, setPWLoad] = useState(false)

  const [pwDelete, setPWDelete] = useState('')
  const [errorDelete, setErrorDelete] = useState(null)
  const [deleteLoad, setDeleteLoad] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)

  const changedName = async (e) => {
    e.preventDefault()
    setdNameMessage(null)
    setdNameError(null)
    const trimmed = dName.trim()
    if (!trimmed) {
      setdNameError('please type the name you want.')
      return
    }
    setdNameLoad(true)
    try {
      const res = await apiChangedName(user, trimmed)
      updateDisplayName(res.display_name)
      setdName('')
      setdNameMessage('Display name has been updated.')
    } catch (error) {
      setdNameError(error.message)
    } finally {
      setdNameLoad(false)
    }
  }

  const changePW = async (e) => {
    e.preventDefault()
    setPWMessage(null)
    setPWError(null)
    if (!curPW) {
      setPWError('Current password is required.')
      return
    }
    if (!newPW) {
      setPWError('New password is required.')
      return
    }
    setPWLoad(true)
    try {
      await apiChangePW(user, curPW, newPW)
      setCurPW('')
      setNewPW('')
      setPWMessage('Password updated successfully.')
    } catch (error) {
      setPWError(error.message)
    } finally {
      setPWLoad(false)
    }
  }

  const deleteAcc = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true)
      return
    }
    setErrorDelete(null)
    if (!pwDelete) {
      setErrorDelete('Password is required to delete your account.')
      return
    }
    setDeleteLoad(true)
    try {
      await apiDeleteAcc(user, pwDelete)
      logout()
      navigate('/')
    } catch (error) {
      setErrorDelete(error.message)
      setDeleteConfirmation(false)
    } finally {
      setDeleteLoad(false)
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
        <form onSubmit={changedName} className="account-field-row">
          <input
            type="text"
            placeholder={displayName}
            value={dName}
            onChange={e => setdName(e.target.value)}
          />
          <button type="submit" disabled={dNameLoad}>
            {dNameLoad ? 'Saving…' : 'Confirm'}
          </button>
        </form>
        {dNameError && <p className="error">{dNameError}</p>}
        {dNameMessage && <p className="success">{dNameMessage}</p>}
      </section>

      <section className="account-section">
        <h2>Change Password</h2>
        <form onSubmit={changePW} className="account-password-form">
          <div className="account-field-row">
            <input
              type="password"
              placeholder="Current password"
              value={curPW}
              onChange={e => setCurPW(e.target.value)}
            />
          </div>
          <div className="account-field-row">
            <input
              type="password"
              placeholder="New password"
              value={newPW}
              onChange={e => setNewPW(e.target.value)}
            />
            <button type="submit" disabled={pwLoad}>
              {pwLoad ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        </form>
        {pwError && <p className="error">{pwError}</p>}
        {pwMessage && <p className="success">{pwMessage}</p>}
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
              {deleteConfirmation && (
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={pwDelete}
                  onChange={e => setPWDelete(e.target.value)}
                />
              )}
              <button
                className="btn-danger"
                onClick={deleteAcc}
                disabled={deleteLoad}
              >
                {deleteLoad ? 'Deleting…' : deleteConfirmation ? 'Confirm Delete' : 'Terminate Account'}
              </button>
            </div>
          </div>
          {errorDelete && <p className="error">{errorDelete}</p>}
          {deleteConfirmation && !deleteLoad && (
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
