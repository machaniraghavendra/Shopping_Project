export default function Rating(props) {
    let times = Math.round(props.times);
    // let showSuccess = props.orderPage;
    return (
        <span>
            {times == 5 &&
                <span className="d-inline-flex gap-1">
                    <i className="bi bi-star-fill text-warning" ></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                </span>
            }
            {times == 4 &&
                <span className="d-inline-flex gap-1">
                    <i className="bi bi-star-fill text-warning" ></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star text-warning"></i>
                </span>
            }
            {times == 3 && 
            <span className="d-inline-flex gap-1">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star text-warning"></i>
                <i className="bi bi-star text-warning"></i>
            </span>
            }
            {times == 2 && 
            <span className="d-inline-flex gap-1">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star text-warning"></i>
                <i className="bi bi-star text-warning"></i>
                <i className="bi bi-star text-warning"></i>
            </span>
            }
            {(times == 1 || times == 0) && 
            <span className="d-inline-flex gap-1">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star text-warning"></i>
                <i className="bi bi-star text-warning"></i>
                <i className="bi bi-star text-warning"></i>
                <i className="bi bi-star text-warning"></i>
            </span>
            }
        </span>
    )
}