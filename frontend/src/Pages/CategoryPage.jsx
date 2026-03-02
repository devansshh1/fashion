import { NavLink, Outlet } from "react-router-dom";

function CategoryPage() {
  return (
    <div className="category-wrapper">

      <div className="category-nav">
        <NavLink to="top" className="nav-item">
          Top 5
        </NavLink>

        <NavLink to="view" className="nav-item">
          View
        </NavLink>

        <NavLink to="saved" className="nav-item">
          Saved
        </NavLink>

        <NavLink to="upload" className="nav-item plus-btn">
          +
        </NavLink>
      </div>

      <div className="category-content">
        <Outlet />
      </div>

    </div>
  );
}

export default CategoryPage;