import "../Error/LoadingPage.css";

export default function LoadingPage(props) {
    return (
        <section className="position-absolute d-flex bg-info" style={{ width: "100%", height: "100%" }}>
            <div className='container-fluid  h-100 vh-10 justify-content-center align-items-center' >
                <div className="container-fluid  text-dark text-center top-50 load">
                    <div className="loader"></div>
                </div>
            </div>
        </section>
    )
}
