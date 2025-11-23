import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/axios";

export default function RedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function go() {
      try {
        const res = await api.get(`/redirect/${code}`);

        if (!res?.data?.targetUrl) {
          navigate("/404");
          return;
        }

        window.location.href = res.data.targetUrl;
      } catch {
        navigate("/404");
      }
    }

    go();
  }, [code]);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}
