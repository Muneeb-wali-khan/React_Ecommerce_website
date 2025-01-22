import React from "react";
import NavbarSideBar from "../../utils/NavbarSideBar";
import Banner from "../../components/User/Banner";

function HomeUser() {


  return (
    <div>
      <NavbarSideBar />
      <main className="flex-1">
        <Banner/>
      </main>
    </div>
  );
}

export default HomeUser;
