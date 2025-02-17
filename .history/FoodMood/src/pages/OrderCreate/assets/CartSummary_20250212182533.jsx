import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";

const CartSummary = ({ cartItems, totalPrice, handleEditItem, handleRemoveItem, onSave }) => {
    const [paidOption, setPaidOption] = useState('ยังไม่ระบุ');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState(null); // เก็บเลขออเดอร์ล่าสุด

    useEffect(() => {
        const fetchLatestOrderNumber = async () => {
            try {
                const todayDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
                const response = await fetch('http://localhost:5000/api/orders'); // เรียก API ดึงข้อมูลออเดอร์ทั้งหมด
                const orders = await response.json();

                // หาออเดอร์ล่าสุดของวันนั้น ๆ
                const todayOrders = orders.filter(order => order.orderDate === todayDate);
                const latestOrder = todayOrders.sort((a, b) => b.orderNumber - a.orderNumber)[0];

                setOrderNumber(latestOrder ? latestOrder.orderNumber + 1 : 1);
            } catch (error) {
                console.error('ไม่สามารถ fecth ข้อมูลจาก databaseได้:', error);
            }
        };

        fetchLatestOrderNumber();
    }, []);

    const handlePaidOptionChange = (e) => {
        setPaidOption(e.target.value);
        setPhoneNumber('');
        setTableNumber('');
    };

    const isDineIn = paidOption === 'ทานที่ร้าน';

    const handleSave = () => {
        const newOrder = {
            orderNumber, // ส่งเลขออเดอร์ไปด้วย
            items: cartItems,
            total: totalPrice,
            orderType: paidOption,
            contactInfo: isDineIn ? { tableNumber } : { phoneNumber },
            orderDate: new Date().toLocaleDateString('en-GB'),
            orderTime: new Date().toLocaleTimeString(),
        };

        onSave(newOrder);
    };

    return (
        <div className="cart-summary">
            <div className='right-box-header fs-26 fw-5 text-center'>
                {orderNumber !== null ? `ออเดอร์ที่ ${orderNumber}` : 'กำลังโหลด...'}
            </div>

            <div className='fs-18 fw-5' style={{ marginTop: "10px" }}>รายการอาหารที่สั่ง</div>
            <ul>
                {cartItems.map((item, index) => (
                    <li className='cart-item-column' style={{ marginTop: "5px" }} key={index}>
                        <div className="cart-item-details">
                            <span className="quantity-box">{item.quantity}</span>
                            <div className="item-info">
                                <div className="item-name">{item.name}</div>
                                <div className="item-size-note fs-14">
                                    {item.size}
                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                        <div className="selected-options">
                                            <ul>
                                                {Object.entries(item.selectedOptions).map(([label, option]) => (
                                                    <li key={label}>{label}: {option}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {item.note && <div className='text-dark-grey'>หมายเหตุ: {item.note}</div>}
                                </div>
                            </div>
                            <span className="cart-item-price">{item.price * item.quantity}</span>
                        </div>
                        <div className='order-edit-del'>
                            <button onClick={() => handleEditItem(index)} className='text-blue invisible-btn fs-14 fw-5' style={{ marginLeft: "28px" }}>แก้ไข</button>
                            <button onClick={() => handleRemoveItem(index)} className='text-red invisible-btn fs-14 fw-5'><FaRegTrashAlt /></button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className='right-box-header'>
                <div className="total-price fs-18 fw-5">
                    <span>ราคารวม:</span>
                    <span className='right'>{totalPrice}</span>
                </div>
            </div>

            <div style={{ marginTop: "10px" }}>
                <label>ตัวเลือกการรับอาหาร: </label>
                <select value={paidOption} onChange={handlePaidOptionChange}>
                    <option value="ยังไม่ระบุ">ยังไม่ระบุ</option>
                    <option value="ทานที่ร้าน">🍽️ ทานที่ร้าน</option>
                    <option value="กลับบ้าน">🏠 กลับบ้าน</option>
                    <option value="Delivery">🚚 Delivery</option>
                    <option value="สั่งแบบไม่ต้องจ่าย">🎉 สั่งแบบไม่ต้องจ่าย</option>
                </select>
            </div>

            {paidOption !== 'ยังไม่ระบุ' && (
                <div style={{ marginTop: "10px" }}>
                    <label>{isDineIn ? "หมายเลขโต๊ะ: " : "เบอร์โทร: "}</label>
                    <input
                        type="text"
                        value={isDineIn ? tableNumber : phoneNumber}
                        onChange={(e) => isDineIn ? setTableNumber(e.target.value) : setPhoneNumber(e.target.value)}
                        placeholder={isDineIn ? "ระบุหมายเลขโต๊ะ" : "ระบุเบอร์โทร"}
                    />
                </div>
            )}

            <div style={{ marginTop: "10px" }}>
                <button className="blue-button" onClick={handleSave}>ยืนยันการสั่ง</button>
            </div>
        </div>
    );
};

export default CartSummary;
