import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuManager.css';
import AddNewMenu from './assets/AddNewMenu';
import MenuItemDetail from './assets/MenuItemDetail';
import MenuList from './assets/MenuList';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Box, Modal, useMediaQuery } from "@mui/material";

const MenuManager = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1180px)");
    const navigate = useNavigate();

    const [data, setData] = useState([]);       // Collecting datas from API     
    const [category, setCategory] = useState([]); // Collecting category from API
    const [showEditData, setShowEditData] = useState(false);        // show AddNewMenu.jsx
    const [showItemDetail, setShowItemDetail] = useState(false);   // show MenuItemDetail.jsx

    const [selectedItem, setSelectedItem] = useState(null);         // Select data/item
    const [dataToEdit, setDataToEdit] = useState(null);             // Edit data
    const [isEditing, setIsEditing] = useState(false);              // Add & Edit data (mode toggle)
    const [dataToDelete, setDataToDelete] = useState(null);         // Delete data

    const [saveState, setSaveState] = useState(false);
    
    // API: Fetch data from database
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({ title: "Sesstion ของคุณหมดอายุ", text: "กรุณาเข้าสู่ระบบใหม่", icon: "warning", confirmButtonColor: "#64A2FF", confirmButtonText: "OK" })
                .then(() => { navigate('/'); });
            return;
        }
        axios.get('http://localhost:5000/api/foods')
            .then(res => { setData(res.data) })
            .catch(err => console.error('Error fetching :', err));
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => {
                setCategory(res.data)
            })
            .catch(err => console.error('Error fetching :', err));
        setSaveState(false)
    }, [saveState]);

    // API: 1.Edit 2.Add
    const handleSaveData = (updatedData) => {
        if (isEditing) {
            axios.put(`http://localhost:5000/api/foods/${dataToEdit._id}`, updatedData)
                .then(res => {
                    //console.log('แก้ไขรายการอาหารเป็น: ', res.data);
                    setData(data.map(user => (user._id === res.data._id ? res.data : user)));
                })
                .catch(err => console.error('แก้ไขรายการอาหารไม่สำเร็จ:', err));
        } else {
            axios.post('http://localhost:5000/api/foods', updatedData)
                .then(res => { setData(prev => [...prev, res.data]); })
                .catch(err => console.error('เพิ่มรายการอาหารเข้าสู่ database ไม่สำเร็จ:', err));
        }
        setShowEditData(false);
    };

    // API: 3.Delete
    const handleDeleteIngredient = (data) => {
        //console.log(data._id);
        axios.delete(`http://localhost:5000/api/foods/${data._id}`)
            .then((res) => {
                //console.log('รายการอาหารที่ต้องการลบ:', res.data);
                Swal.fire({
                    title: 'รายการอาหารถูกลบแล้ว!',
                    confirmButtonColor: '#64A2FF',
                    icon: 'success',
                });
                setData((prevData) => prevData.filter((item) => item._id !== data._id));
            })
            .catch((err) => {
                //console.error('เกิดข้อผิดพลาดในการลบรายการอาหาร:', err);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาดในการลบรายการอาหาร',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                });
            });
    }


    // Function: Edit selected data
    const handleEditData = (data) => {
        setDataToEdit(data);
        setIsEditing(true); // เปลี่ยนโหมดเป็น Edit
        setShowEditData(true);
        setShowItemDetail(false);
    };

    // Function: Add new data
    const handleAddNewData = () => {
        setDataToEdit({ name: '', category_id: null, category: '', sizePrices: [], customOptions: [] });
        setIsEditing(false); // เปลี่ยนโหมดเป็น Add
        setShowEditData(true);
        setShowItemDetail(false);

        setSelectedItem({ name: '', category_id: null, category: '', sizePrices: [], customOptions: [] });
    };

    // Function: Cancel add or edit data
    const handleCancel = () => {
        setShowEditData(false);
        setShowItemDetail(false);
    };

    // Function: Select data to show "MenuItemDetail.jsx"
    const handleMenuClick = (item) => {
        console.log(item)
        setShowItemDetail(true);
        setSelectedItem(item);
        setShowEditData(false);
    };

    // Function: Confirm delete window
    const handleClickConfirm = (e) => {
        setDataToDelete(e);
        Swal.fire({
            title: "แน่ใจใช่ไหม?",
            text: "คุณกำลังจะลบ" + "\nชื่ออาหาร: " + e.name,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff4b4b",
            cancelButtonColor: "#B2B2B2",
            confirmButtonText: 'ยืนยันการลบ',
            cancelButtonText: 'ยกเลิก',
            dangerMode: true,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteIngredient(e);
                setShowEditData(false);
            } else {
                Swal.fire({
                    title: 'ยกเลิกการลบ',
                    confirmButtonColor: '#64A2FF',
                });
            }
        });
    };

    const handleSave = () => {
        setSaveState(true)
        setShowEditData(false)
    }

    return (
        <>
            {/* Box ของ MenuList */}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    width: isMobile ? "100%" : isTablet ? "65%" : "75%",
                    height: "100vh",
                    padding: "20px",
                    borderRadius: "8px",
                    overflowY: "auto",
                    marginRight: "10px",
                }}
            >
                <MenuList
                    data={data}
                    category={category}
                    onMenuClick={handleMenuClick}
                    onAddNewMenu={handleAddNewData}
                    selectedItem={selectedItem}
                />
            </Box>

            {/* Desktop & Tablet: แสดง AddMenu และ MenuItemDetail ด้านขวา */}
            {!isMobile && (showEditData || showItemDetail) && (
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        width: isTablet ? "35%" : "25%", // Box ของ Tablet = 30%, Desktop = 25%
                        height: "100vh",
                        padding: "20px",
                        borderRadius: "8px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {showEditData && (
                        <AddNewMenu
                            form={isEditing ? "Edit" : "Add"}
                            dataToEdit={dataToEdit}
                            data={selectedItem}
                            isEditing={isEditing}
                            onCancel={handleCancel}
                            onSave={handleSaveData}
                            setShowItemDetail={handleSave}
                        />
                    )}
                    {showItemDetail && (
                        <MenuItemDetail
                            selectedItem={selectedItem}
                            onEdit={handleEditData}
                            handleClickConfirm={handleClickConfirm}
                            onClose={() => setShowItemDetail(false)}
                        />
                    )}
                </Box>
            )}

            {/* Mobile - ใช้ Modal */}
            {isMobile && (
                <Modal
                    open={showEditData || showItemDetail}
                    onClose={() => {
                        setShowEditData(false);
                        setShowItemDetail(false);
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            maxWidth: "90vw",
                            height: "80vh",
                            margin: "10vh auto",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {showEditData && (
                            <AddNewMenu
                                form={isEditing ? "Edit" : "Add"}
                                dataToEdit={dataToEdit}
                                data={selectedItem}
                                isEditing={isEditing}
                                onCancel={handleCancel}
                                onSave={handleSaveData}
                                setShowItemDetail={handleSave}
                            />
                        )}
                        {showItemDetail && (
                            <MenuItemDetail
                                selectedItem={selectedItem}
                                onEdit={handleEditData}
                                handleClickConfirm={handleClickConfirm}
                                onClose={() => setShowItemDetail(false)}
                            />
                        )}
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default MenuManager;