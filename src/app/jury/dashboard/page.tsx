/**
 * PAGE PROTÉGÉE - DASHBOARD JURY
 * Role: Espace de travail pour les membres du jury.
 */
import { getUserRole } from "@/lib/auth/get-user-role";

export default async function JuryDashboardPage() {
  const user = await getUserRole();

  return (
    <main>
      <h1>Jury — tableau de bord</h1>
      <p>
        Rôle : <strong>{user?.role}</strong> — approuvé :{" "}
        <strong>{String(user?.is_approved)}</strong>
      </p>
    </main>
  );
}
