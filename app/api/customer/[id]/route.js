
import Customer from "@/models/Customer";

export async function GET(request, { params }) {
  const { id } = params;
  const customer = await Customer.findById(id);
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const customer = await Customer.findByIdAndUpdate(id, body, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const customer = await Customer.findByIdAndUpdate(id, body, { new: true });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json({ message: "Customer deleted successfully" });
}