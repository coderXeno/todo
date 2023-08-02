import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

export default function CheckoutPage(){
    const params = useParams();
    const [qParams, setQParams] = useSearchParams();
    const [itemData, setItemData] = useState();
    const [showPayment, setShowPayment] = useState(false);
    const [cardNo, setCardNo] = useState("");

    useEffect(() => {
        const productId = qParams.get("productId"); 
        axios.get(`/api/get-items/?productId=${productId}`)
            .then((res) => setItemData(res.data.data))
            .catch((err) => console.log(err));
    }, []);

    const handlePayment = (event) => {
        toast.success("Payment Successful");
    };

    return(
        <div>
            Checkout Page
            {itemData && <div>
                <img src={data.image} />
                <p>{data.title}</p>    
                <p>{data.price}</p>
                <button onClick={(e) => setShowPayment((prev) => true)}>Start Payment</button>
            </div>}
            {
                <Modal
                    open={showPayment}
                    onClose={(event) => setShowPayment((prev) => false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{display: "flex", flexDirection: "column"}}
                >
                    <div>
                        <input placeholder="Enter Card Number" onChange={(event) => setCardNo(event.target.value)} />
                        <Button disabled={cardNo.length === 0} variant="contained" onClick={handlePayment}>Process Payment</Button>
                    </div>
                </Modal>
            }
            <ToastContainer />
        </div>
    )
}