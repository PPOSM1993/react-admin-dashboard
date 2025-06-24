import UserTable from "../components/UserTable";

const mockUsers = [
  { name: "Juan Pérez", email: "juan@example.com", role: "Administrador", status: "activo" },
  { name: "María López", email: "maria@example.com", role: "Soporte", status: "activo" },
  { name: "Carlos Ruiz", email: "carlos@example.com", role: "Editor", status: "inactivo" },
  { name: "Ana Torres", email: "ana@example.com", role: "Supervisor", status: "activo" },
];

export default function Users() {
  return (
    <div>
      <UserTable users={mockUsers} />
    </div>
  );
}
