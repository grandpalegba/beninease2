/**
 * PAGE PROTÉGÉE - DASHBOARD ADMIN
 * Role: Vue d'ensemble du statut admin.
 */
import { getUserRole } from "@/lib/auth/get-user-role";

export default async function AdminDashboardPage() {
  const user = await getUserRole();

  return (
    <main>
      <h1>Admin — tableau de bord</h1>
      <p>
        Connecté en tant que <strong>{user?.role}</strong> (id: {user?.id})
      </p>
    </main>
  );
}
