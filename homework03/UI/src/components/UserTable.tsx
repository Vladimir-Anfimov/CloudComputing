function UserTable({ user }: { user: any }) {
  return (
    <table className="table">
      <tbody>
        <tr>
          <th>Email</th>
          <td>{user.email}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default UserTable;
