
type ModalProps = {
    children: React.ReactNode;
    onClose:() => void;
};

const Modal = ({children,onClose}:ModalProps) => {
    return (
    <>

    <div 
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={onClose}
    />
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        {children}
    </div>

        </>
    )
};
export default Modal;