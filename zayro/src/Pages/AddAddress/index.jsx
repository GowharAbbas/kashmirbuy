import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { MdDeleteForever } from "react-icons/md";
import { Modal, Box, Typography, IconButton, Radio } from "@mui/material";
import AccountSideBar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const AddAddress = () => {
  const [addressFields, setAddressFields] = useState({
    fullName: "",
    email: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const [addressList, setAddressList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/");

    if (context?.userData?._id) {
      setUserId(context.userData._id);
    }
  }, [context?.userData]);

  useEffect(() => {
    if (userId) getUserAddresses();
  }, [userId]);

  const onChangeAddressInput = (e) => {
    const { name, value } = e.target;
    setAddressFields({ ...addressFields, [name]: value });
  };

  const getUserAddresses = async () => {
    const res = await fetchDataFromApi(`/api/address/get?userId=${userId}`);
    if (res?.error === false) setAddressList(res.address);
    else setAddressList([]);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const addressData = { ...addressFields, userId, status: true };

    for (const key in addressData) {
      if (!addressData[key]) {
        context.openAlertBox("error", `Please enter ${key.replace("_", " ")}`);
        setIsLoading(false);
        return;
      }
    }

    const res = await postData("/api/address/add", addressData);
    setIsLoading(false);

    if (res?.error === false) {
      context.openAlertBox("success", "Address added");

      setAddressFields({
        fullName: "",
        email: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        mobile: "",
      });

      setOpenModal(false);
      getUserAddresses();
    } else {
      context.openAlertBox("error", res?.message || "Something went wrong");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    const res = await deleteData(`/api/address/delete/${id}`);
    if (res?.error === false) {
      context.openAlertBox("success", "Deleted successfully");
      getUserAddresses();
    } else {
      context.openAlertBox("error", res?.message || "Failed to delete");
    }
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);

    const selected = addressList.find((a) => a._id === id);
    localStorage.setItem("selectedAddress", JSON.stringify(selected));

    context.openAlertBox("success", "Address selected for checkout");
  };

  return (
    <section className="!py-14 w-full bg-[#f5f5f5]">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[25%]">
          <AccountSideBar />
        </div>

        <div className="w-full lg:w-[75%]">
          <div className="card bg-white !p-5 shadow-md rounded-md">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-semibold">My Addresses</h2>

              <Button
                className="btn-org"
                variant="contained"
                onClick={() => setOpenModal(true)}
              >
                Add Address
              </Button>
            </div>

            {/* SAVED ADDRESSES */}
            <div className="!mt-6">
              <h3 className="text-[16px] !mb-2 font-medium">Saved Addresses</h3>

              {addressList.length === 0 ? (
                <p className="text-gray-500">No addresses added yet.</p>
              ) : (
                addressList.map((addr) => (
                  <div
                    key={addr._id}
                    className={`border rounded-md !p-3 !mb-3 bg-[#fafafa] relative flex gap-3 ${
                      selectedAddressId === addr._id
                        ? "border-red-500 border-2"
                        : "border-gray-300"
                    }`}
                  >
                    <Radio
                      checked={selectedAddressId === addr._id}
                      onChange={() => handleSelectAddress(addr._id)}
                      color="error"
                    />

                    <div className="flex-1">
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="absolute top-2 right-2 text-red-500"
                      >
                        <MdDeleteForever size={22} />
                      </button>

                      <p>
                        <strong>Name:</strong> {addr.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {addr.email}
                      </p>
                      <p>
                        <strong>Address:</strong> {addr.address_line},{" "}
                        {addr.city}, {addr.state}
                      </p>
                      <p>
                        <strong>Pincode:</strong> {addr.pincode}
                      </p>
                      <p>
                        <strong>Country:</strong> {addr.country}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {addr.mobile}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600, md: 700 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
          }}
        >
          <div className="flex justify-between items-center !mb-4">
            <Typography className="text-[18px]">Add New Address</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <IoClose size={22} />
            </IconButton>
          </div>

          <form onSubmit={handleAddAddress} className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {[
                "fullName",
                "email",
                "address_line",
                "city",
                "state",
                "pincode",
                "country",
                "mobile",
              ].map((field) => (
                <TextField
                  key={field}
                  label={field.replace("_", " ").toUpperCase()}
                  name={field}
                  size="small"
                  className="w-full sm:w-[48%]"
                  value={addressFields[field]}
                  onChange={onChangeAddressInput}
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 !mt-4">
              <Button
                className="btn-org btn-border"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                variant="contained"
                className="btn-org"
              >
                {isLoading ? <CircularProgress size={22} /> : "Save"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </section>
  );
};

export default AddAddress;
