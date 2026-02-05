import './DeleteModal.css'

function DeleteModal({ service, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Service</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete <strong>{service.name}</strong>?</p>
          <p className="warning">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
