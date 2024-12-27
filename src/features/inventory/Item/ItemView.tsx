// import { useState } from "react";
// import PencilIcon from "../../../assets/icons/PencilIcon"
// import Modal from "../../../Components/model/Modal"

// type Props = {selectedItem:any,openModalss:()=>void}

// function ItemView({selectedItem }: Props) {
//     console.log(selectedItem,"selectedItem");
    
//       const [isModalOpen, setModalOpen] = useState(false);

    
//       const closeModal = () => {
//         setModalOpen(false);
//       };
    
//     return (
//         <>
//         <div onClick={openModalss}>
//             <PencilIcon color="red" />
//         </div>

//             <Modal open={isModalOpen} onClose={closeModal} style={{ width: '80%' }}>
//                 <div>
//                     hai
//                 </div>
//             </Modal>
//         </>
//     )
// }

// export default ItemView