import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/style.css"

export default function KeepingList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const userId = JSON.parse(sessionStorage.getItem("userData")).userId;


  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = (page) => {
    setLoading(true);
    axios
      .get(`/api/keepings/${userId}?page=${page - 1}&size=10`)
      .then((response) => {
        setData(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleRowClick = (keepingId) => {
    navigate(`/book/${keepingId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const keepStatusMap = {
    0: "승인대기",
    1: "보관중",
    2: "대여중",
    3: "반환 신청",
    4: "반환 완료",
  };

  if (loading) return <p>Loading....</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <>
      <div className="book-keeping-container">
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th className="col-status">보관상태</th>
              <th className="col-author">작성자</th>
              <th className="col-date">게시일</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.keepingId} onClick={() => handleRowClick(item.keepingId)}>
                <td className="col-title">{item.bookName}</td>
                <td className="col-status">{keepStatusMap[item.keepStatus]}</td>
                <td className="col-author">{item.userName}</td>
                <td className="col-date">{item.keepDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="pagination-list">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={page === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </>
  );
}
