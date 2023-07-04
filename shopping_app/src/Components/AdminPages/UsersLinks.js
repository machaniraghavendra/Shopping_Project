import { Link } from "react-router-dom";

export default function UsersLinks(props) {
    return (
        <div className="container-fluid">
            <div className="h5">Admin Links</div>
            <div className="container btn-group gap-3 my-2">
                <Link to={"/admin/usersList"} className="btn btn-warning">List of Users</Link>
                <Link to={"/admin/itemsList"} className="btn btn-warning">List of Items</Link>
            </div>
        </div>
    )
}