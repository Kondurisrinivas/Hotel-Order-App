import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const initializeOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || { T1: [], T2: [], T3: [] };
    setOrders(storedOrders);
  };

  useEffect(() => {
    initializeOrders();
  }, []);

  const isUniqueIdUnique = (roomId, uniqueId) => {
    const allUniqueIds = Object.values(orders)
      .flat()
      .map((order) => order.uniqueId);

    return !allUniqueIds.includes(uniqueId);
  };

  const [orders, setOrders] = useState({ T1: [], T2: [], T3: [] });
  const [formData, setFormData] = useState({
    uniqueId: '',
    price: '',
    dishName: '',
    roomNo: 'T1',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddToBill = () => {
    const { uniqueId, price, dishName, roomNo } = formData;

    // Validations
    if (!/^\d+$/.test(uniqueId) || !isUniqueIdUnique(roomNo, uniqueId)) {
      return;
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(dishName)) {
      return;
    }

    const orderDetails = { uniqueId, price, dishName };
    setOrders((prevOrders) => ({
      ...prevOrders,
      [roomNo]: [...prevOrders[roomNo], orderDetails],
    }));
    setFormData({
      uniqueId: '',
      price: '',
      dishName: '',
      roomNo: 'T1',
    });
  };

  const handleDeleteOrder = (roomNo, index) => {
    setOrders((prevOrders) => {
      const i=0;
      const updatedOrders = { ...prevOrders };
      updatedOrders[roomNo] = updatedOrders[roomNo].filter((_, i) => i !== index);
      return updatedOrders;
    });
  };

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <div className="App">
      <div>
        <label>
          Unique ID:
          <input
            type="text"
            name="uniqueId"
            value={formData.uniqueId}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Dish Name:
          <input
            type="text"
            name="dishName"
            value={formData.dishName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Table No:
          <select
            name="roomNo"
            value={formData.roomNo}
            onChange={handleInputChange}
          >
            <option value="T1">Table 1</option>
            <option value="T2">Table 2</option>
            <option value="T3">Table 3</option>
          </select>
        </label>
        <button onClick={handleAddToBill}>Add to Bill</button>
      </div>

      <div className="orders-container">
        {Object.entries(orders).map(([table, tableOrders]) => (
          <div key={table}>
            <h2>{`Table ${table.charAt(1)}`}</h2>
            {tableOrders.length === 0 ? (
              <p className="no-orders">No orders for now</p>
            ) : (
              <ul>
                {tableOrders.map((order, index) => (
                  <li key={index}>
                    <b>{order.uniqueId}</b>-<b>{order.dishName}</b>-<b>₹{order.price}</b>
                    <button onClick={() => handleDeleteOrder(table, index)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
