import toast from "react-hot-toast";

export const onError =  (error:any) => {

  const message = error?.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg) => toast.error(msg));
      } else if (typeof message === "string") {
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
}

};
