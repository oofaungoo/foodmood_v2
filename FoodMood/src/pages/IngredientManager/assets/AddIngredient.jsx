import React, { useState, useEffect } from 'react';

const AddIngredient = ({ data, onClose, onSave, isEditing }) => {

    // Function: Input handle change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setEditedData((prev) => ({ ...prev, [id]: value }));
    };

    // Function: Show information for user
    const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    // Default data (use for add new data)
    const [editedData, setEditedData] = useState({
        name: '',
        group: '',
        min: null,
        remain: null,
        unit: 'kg',
    });

    // API: Fetch "data" form database (Data already exist in database)
    useEffect(() => {
        setEditedData({
            name: data.name,
            group: data.group,
            unit: 'kg',
            remain: data.remain,
            min: data.min,
        });
    }, [data]);

    // Function: Save edited data (Data already exist in database)
    const handleSave = (e) => {
        {/* const updatedData = {...editedData}; console.log('วัตถุดิบ (จากคำสั่ง Save ข้างใน):', updatedData); */}    //แสดงข้อมูลใน console.log เพื่อเช็คเฉย ๆ
        onSave(editedData)
    };

    return (
        <div className="right-box">
            <div className="fs-20 fw-5 right-box-header text-center" style={{ marginBottom: "10px" }}>
                เพิ่มวัตถุดิบใหม่
            </div>

            <label>ชื่อวัตถุดิบ</label>
            <input
                id="name"
                type="text"
                value={editedData.name || ''}
                onChange={handleChange}
                placeholder="ชื่อวัตถุดิบ เช่น น่องไก่ สะโพกไก่"
                style={{ marginBottom: "10px" }}
                required
            />

            <label>หมวดหมู่</label>
            <select
                id="group"
                value={editedData.group || ''}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
                required
            >
                <option value="">-- เลือกหมวดหมู่ (Category) --</option>
                <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                <option value="ผัก">ผัก</option>
                <option value="ทะเล">ทะเล</option>
                <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                <option value="ผลไม้">ผลไม้</option>
            </select>

            <label>หน่วยวัตถุดิบ</label>
            <select
                id="unit"
                value={editedData.unit}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
            >
                <option value="kg">กิโลกรัม</option>
                <option value="g">กรัม</option>
            </select>

            <label>จำนวนวัตถุดิบขั้นต่ำ</label>
            <div className="inline-elements">
                <input
                    type="number"
                    id="min"
                    value={editedData.min || ''}
                    onChange={handleChange}
                    placeholder="จำนวนขั้นต่ำ"
                    required
                />
                <button
                    type="button"
                    className="info-button"
                    onClick={toggleInfo}
                    title="คลิกเพื่อดูข้อมูลเพิ่มเติม"
                >
                    ℹ️
                </button>
            </div>
            
            {showInfo && (
                <div className='fs-14' >
                    หากวัตถุดิบ <span className="text-red">"จำนวนคงเหลือ"</span> ในระบบน้อยกว่า <span className="text-red">"จำนวนขั้นต่ำ"</span> ระบบจะทำการแจ้งเตือนผู้ใช้ให้ทราบ
                </div>
            )}
            <div className="right-box-header" style={{ marginTop: '10px' }}></div>

            <div className='text-center' style={{ marginBottom: "10px", marginTop: "10px" }}>
                <div>จำนวนวัตถุดิบคงเหลือ</div>
                <input
                    type="number"
                    id="remain"
                    value={editedData.remain || ''}
                    onChange={handleChange}
                    placeholder="จำนวนคงเหลือ"
                    required
                />
            </div>

            <div className="order-action-buttons" style={{ marginTop: "10px" }}>
                <button className="blue-button" onClick={() => handleSave(editedData)}>บันทึก</button>
                <button type="button" className="red-button" onClick={onClose}>ยกเลิก</button>
            </div>
        </div>
    );
};

export default AddIngredient;
