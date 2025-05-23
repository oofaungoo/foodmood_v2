import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../OrderCheck/OrderCheck.jsx';
import { Grid, Box, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from "framer-motion";

const OrderHistory_detail = ({ selectedOrder, onClose, updateOrder }) => {
    const [categoryList, setCategoryList] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");

    // API: Fetch data from database (1.Food category 2.Food size 3.Ingredient)
    useEffect(() => {
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategoryList(res.data); })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    const availableCategories = [...new Set(selectedOrder?.orderItems?.map(item => item.category))];
    const filteredItems = filterCategory
        ? selectedOrder?.orderItems?.filter(item => item.category === filterCategory)
        : selectedOrder?.orderItems || [];

    if (!selectedOrder) {
        return <p>ไม่มีข้อมูลออเดอร์</p>;
    }

    const orderTypeColors = {
            "ทานที่ร้าน": "#64A2FF",
            "กลับบ้าน": "#ff7878",
            "Delivery": "#4CAF50",
            "สั่งแบบไม่ต้องจ่าย": "#ff63ff",
        }
        
    return (
        <>
            <Grid container sx={{ borderBottom: "2px solid #ddd", paddingBottom: "8px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid item>
                    <p style={{ fontSize: 26, fontWeight: 500, margin: 0 }}>ออเดอร์ที่ {selectedOrder.orderNumber}</p>
                </Grid>
                <CloseIcon style={{ fontSize: 18, color: "#ff4b4b", cursor: "pointer", position: "absolute", right: 0 }} onClick={onClose} />
            </Grid>

            <Grid container spacing={0.5} style={{ marginTop: "10px" }} paddingBottom="8px" marginBottom="8px" borderBottom="1px solid #ddd">
                <Grid item xs={12}>
                    <p style={{ fontSize: 18, fontWeight: 500 }}>รายละเอียดออเดอร์:</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>STAFF:</p>
                    <p>{selectedOrder.employeeName}</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>สถานะ:</p>
                    <p>{selectedOrder.orderStatus}</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>วัน/เวลา:</p>
                    <p>{selectedOrder.orderDate}</p>
                    <p>{selectedOrder.orderTime}</p>
                </Grid>

                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <p style={{ color: "#ff7878", fontWeight: 500, fontSize: 20 }}>{selectedOrder.orderType}</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <p>
                        {selectedOrder.contactInfo.tableNumber
                            ? `โต๊ะที่ ${selectedOrder.contactInfo.tableNumber}`
                            : selectedOrder.contactInfo.phoneNumber
                                ? `เบอร์โทร ${selectedOrder.contactInfo.phoneNumber}`
                                : "ไม่ระบุโต๊ะหรือเบอร์โทร"}
                    </p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <p style={{ color: "#62c965", fontWeight: 500, fontSize: 20 }}>{selectedOrder.paidType}</p>
                </Grid>
            </Grid>

            <p style={{ fontSize: 18, fontWeight: 500 }}>รายการอาหารที่สั่ง</p>

            {/* ฟิลเตอร์เลือกหมวดหมู่ */}
            <div className="filter-bubble-container">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {/* Bubble ALL */}
                    <div className={`filter-bubble ${filterCategory === "" ? "active" : ""}`} onClick={() => setFilterCategory("")}>ALL</div>

                    {/* Bubble Categories (เฉพาะหมวดหมู่ที่มีอยู่จริงในออเดอร์) */}
                    {availableCategories.map((category) => (
                        <div key={category} className={`filter-bubble ${filterCategory === category ? "active" : ""}`} onClick={() => setFilterCategory(category)}>
                            {category}
                        </div>
                    ))}
                </div>
            </div>

            {/* รายการอาหารที่ถูกกรอง */}
            <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Grid sx={{ borderBottom: "1px solid #ddd", marginTop: "10px", paddingBottom: "5px" }}>
                            <Grid container spacing={2} >
                                {/* จำนวนสินค้า */}
                                <Grid item xs={2} sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                                    <Box sx={{ backgroundColor: "#F2F2F2", border: "1px solid #ddd", padding: "4px 12px", borderRadius: "4px", textAlign: "center", }}>
                                        {item.quantity}
                                    </Box>
                                </Grid>

                                {/* ชื่อสินค้า + ตัวเลือก */}
                                <Grid item xs={7}>
                                    <Typography sx={{ fontSize: "18px", fontFamily: "inherit", fontWeight: 500, color: "#333", lineHeight: "1.4", }}>
                                        {item.name}
                                    </Typography>

                                    <div className="item-size-note fs-14" style={{ color: "#666" }}>
                                        {item.size}
                                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                            <div className="selected-options">
                                                <ul>
                                                    {Object.entries(item.selectedOptions).map(([label, option]) => (
                                                        <li key={label} style={{ fontSize: "12px", color: "#888" }}>
                                                            {label}: {option}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </Grid>


                                {/* ราคาสินค้าอยู่ขวาสุด */}
                                <Grid item xs={3} sx={{ textAlign: "right", fontSize: "16px", ml: "auto" }}>
                                    {item.price * item.quantity} ฿
                                </Grid>
                            </Grid>
                        </Grid>
                    </motion.div>
                ))}
            </AnimatePresence>

        </>
    );
};

export default OrderHistory_detail;
