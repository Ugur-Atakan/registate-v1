import { useEffect, useState } from "react";
import instance from "../../../../http/instance";
import NewCompanyMember from "../../../../components/NewCompanyMember";

interface SectionProps {
  companyId: string;
}

export default function CompanyMembersSection({ companyId }: SectionProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);

  const getCompanyUsers = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/admin/company/${companyId}/members`);
      setMembers(response.data);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCompanyUsers();
  }, [companyId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Members</h2>
      {members && members.length > 0 ? (
        <ul className="space-y-4">
          {members.map((user: any) => (
            <li
              key={user.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div className="flex items-center">
                <img
                  src={
                    user.profileImage ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                Update User
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
      <button 
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => setShowAddUser(!showAddUser)}
      >
        {showAddUser ? "Close Form" : "Add User"}
      </button>
      {showAddUser && (
        <div className="mt-4">
          <NewCompanyMember companyId={companyId} />
        </div>
      )}
    </div>
  );
}
