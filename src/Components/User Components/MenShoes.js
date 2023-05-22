import React, { useContext, useEffect, useState } from 'react'
import ProductContext from '../../Context/Products/ProductContext';

const MenShoes = (props) => {
    const context = useContext(ProductContext);
    const { products, menItems, casualMen, formalMen, ethnicMen, addCart } = context;

    useEffect(() => {
        if (props.shoetype === "CasualMen") {
            casualMen();
        } else if (props.shoetype === "FormalMen") {
            formalMen();
        } else if (props.shoetype === "EthnicMen") {
            ethnicMen();
        } else {
            menItems();
        }
    }, []);
    // console.log("Props.Shoetype: " + props.shoetype);

    const [credentials, setCredentials] = useState({ number: "", address: "" });
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const btmove = (e) => {
        let movingBtn = document.getElementById("outdiv");
        if (credentials.number || credentials.address === "") {
            if (movingBtn.className === "d-flex justify-content-start") {
                movingBtn.className = Math.floor(Math.random() * 12) > 6 ? "d-flex justify-content-center" : "d-flex justify-content-end"
            } else if (movingBtn.className === "d-flex justify-content-center") {
                movingBtn.className = Math.floor(Math.random() * 12) > 6 ? "d-flex justify-content-start" : "d-flex justify-content-end"
            } else if (movingBtn.className === "d-flex justify-content-end") {
                movingBtn.className = Math.floor(Math.random() * 12) > 6 ? "d-flex justify-content-start" : "d-flex justify-content-center"
            }
        }
        else {
            movingBtn.className = "d-flex justify-content-center";
        }
    }

    const handleDetails = () => {
        console.log("Handled");
        localStorage.setItem("Number", credentials.number);
        localStorage.setItem("Address", credentials.address);
    }

    return (
        <>
            <div id='divItem' className='container-fluid'>
                <div className='row'>
                    {/* Below code is for modal popup. */}
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Order - Delivery related details.</h1>
                                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                </div>
                                <div className="modal-body">

                                    {/* <form onSubmit={handleDetails}> */}
                                    <div className="form-floating mb-3">
                                        <input style={{ color: "white" }} type="number" required className="form-control bg-dark" value={credentials.number} onChange={onChange} id="number" name='number' placeholder="Phone Number" />
                                        <label htmlFor="number">Contact No.</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input style={{ color: "white" }} type="text" required className="form-control bg-dark" value={credentials.address} onChange={onChange} id="address" name='address' placeholder='Address' />
                                        <label htmlFor="address">Address</label>
                                    </div>

                                    {/* <button style={{ width: "100%", backgroundColor: "blue" }} type="submit" className="btn btn-primary my-1"><b>Submit</b></button> */}

                                    <div id='outdiv' className='d-flex justify-content-center'>
                                        <div style={{ width: "30%" }} id='indiv' onMouseOver={(credentials.number || credentials.address) === "" ? btmove : ""}>
                                            <button onClick={handleDetails} disabled={credentials.number === "" || credentials.address === ""} style={{ width: "100%", backgroundColor: "blue" }} type="submit" className="btn btn-primary my-1" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#exampleModal2"><b>Submit</b></button>
                                        </div>
                                    </div>
                                    {/* </form> */}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Hurrayyy</h1>
                                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                </div>
                                <div className="modal-body">
                                    <h2>Shoe ordered successfully 😎 </h2>
                                </div>
                                <div className="modal-footer">
                                    <button style={{ width: "100%" }} type="button" className="btn btn-info" data-bs-dismiss="modal">Ok</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {products.map((element) => {
                        return <div className='d-flex justify-content-center col-xxl-3 col-6 my-3' key={element._id}>
                            {/* <img style={{height: "100%", width: "100%"}} src={element.image} alt="" /> */}
                            <div id='productcard' className="card">
                                <img id='productimg' src={element.image} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{element.brand}</h5>
                                    <p className="card-text">{element.price}</p>

                                    <button onClick={() => { addCart(element._id); /* </div>props.showAlert("Product deleted successfully", "success");*/ }} className="btn btn-info cartbtn">🛒</button>
                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-info buybtn">Buy now</button>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default MenShoes