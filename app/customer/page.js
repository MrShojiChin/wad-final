"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const startEdit = (customer) => () => {
    setEditMode(true);
    reset(customer);
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${APIBASE}/customer`);
      const data = await response.json();
      const customersWithId = data.map((customer) => {
        customer.id = customer._id;
        return customer;
      });
      setCustomers(customersWithId);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const createOrUpdateCustomer = async (data) => {
    try {
      if (editMode) {
        const response = await fetch(`${APIBASE}/customer/${data._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Failed to update customer: ${response.status}`);
        }

        alert("Customer updated successfully");
        setEditMode(false);
      } else {
        const response = await fetch(`${APIBASE}/customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Failed to add customer: ${response.status}`);
        }

        alert("Customer added successfully");
      }

      reset({
        name: "",
        dateOfBirth: "",
        interests: "",
      });
      fetchCustomers();
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`${APIBASE}/customer/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }

      alert("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64">
          <form onSubmit={handleSubmit(createOrUpdateCustomer)}>
            <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Date of Birth (Number):</div>
              <div>
                <input
                  name="dateOfBirth"
                  type="number"
                  {...register("dateOfBirth", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div>Interests (comma-separated):</div>
              <div>
                <input
                  name="interests"
                  type="text"
                  {...register("interests", { required: true })}
                  className="border border-black w-full"
                />
              </div>
              <div className="col-span-2">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({ name: "", dateOfBirth: "", interests: "" });
                      setEditMode(false);
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Customers ({customers.length})</h1>
          <ul className="list-disc ml-8">
            {customers.map((customer) => (
              <li key={customer._id}>
                <button
                  className="border border-black p-1/2"
                  onClick={startEdit(customer)}
                >
                  📝
                </button>{" "}
                <button
                  className="border border-black p-1/2"
                  onClick={deleteById(customer._id)}
                >
                  ❌
                </button>{" "}
                <Link href={`/customer/${customer._id}`} className="font-bold">
                  {customer.name}
                </Link>{" "}
                - Date of Birth: {customer.dateOfBirth}, Interests:{" "}
                {customer.interests.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}