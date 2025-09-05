import { useSelector } from "react-redux";
import type { RootState } from "../../../slices/store/store";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../api/axios";
import type { ApiResponse } from "../../../types/ApiResponse";
import { Calendar, Download, MoreHorizontal, Paperclip, UserRound } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import Loader from "../../Loader"; 
import type { AxiosError } from "axios";
import type { CommentProps, CommentResponse } from "../types";



const Activity = () => {

  const {project} = useSelector((state: RootState) => state.project)

if(!project) return

const [allComment, setAllComment] = useState<CommentProps[]>([])
const [isLoading, setIsLoading] =  useState<boolean>(false)
const [isAttachmentLoading, setIsAttachmentLoading] = useState<boolean>(false)


const fetchAllComments = async () => {
  try {
    setIsLoading(true)
      const response  = await axiosInstance.get<CommentResponse>(`/projects/${project.id}/comments`)

if(response.data.success){
setAllComment(response.data.allComments)
}


  } catch (error) {
    console.error("Error while fetch all comments and attachments : ",error)
    const axiosError = error as AxiosError<ApiResponse>
    const errorMessage = axiosError ?  axiosError.response?.data.message : "Error while fetch all comments and attachments!"

    toast.error(errorMessage)

  }finally{
    setIsLoading(false)
  }
}



useEffect(() => {
if(!project) return 

fetchAllComments()   

}, [project.id])



  const downloadAttachment = async (attachmentUrl: string) => {
    try {
      setIsAttachmentLoading(true)
      const attachmentUrlObject = new URL(attachmentUrl);
      const pathname = attachmentUrlObject.pathname.substring(1);
      const fileType = pathname.split('.').pop();
      const response = await axiosInstance.post(
        '/download/file',
        { fileUrl: pathname },
        { responseType: 'blob' },
      );

      const goodUrl = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = goodUrl;
      a.download = `attachment.${fileType}`;
      a.click();
      URL.revokeObjectURL(goodUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download attachment!');
    }finally{
      setIsAttachmentLoading(false)
    }
  };

  if(isLoading){
    return <Loader /> 
  }

return (
  <div className="mt-10">

  
{allComment.length === 0 ?  (
  <p>no comment dnd attachemanet found </p>
) : (
  allComment.map((comment) => (

    
  <div className="p-4 mt-5 bg-white rounded-lg shadow-md border border-gray-300 space-y-4">


   <div className="flex justify-between items-center">
     <div className="flex items-center gap-2">
       <Calendar color="#4B5563" size={24} />
       <p className="text-slate-600 text-base font-medium">December 21, 2024</p>
     </div>
  
     <div className="flex items-center gap-2">
       <Button variant="ghost" className="p-0 rounded-full bg-gray-200 hover:bg-gray-300">
         <UserRound size={28} />
       </Button>
       <p className="text-black text-base font-semibold">{comment.employee.fullname.charAt(0).toUpperCase() + comment.employee.fullname.slice(1, comment.employee.fullname.length)}</p>
     </div>
   </div>


   <div className="space-y-2">
     <div className="flex items-center justify-between">
       <p className="font-semibold text-black text-lg">Comment</p>
       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-gray-300">
         <MoreHorizontal className="h-4 w-4" />
       </Button>
     </div>

    {comment.text && (
       <p className="text-gray-700 text-md leading-relaxed">
     {comment.text}
     </p> 
    )}
{comment.attachmentUrl  && (
  
     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
       <div className="flex items-center gap-3">
         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
           <Paperclip className="h-4 w-4 text-blue-600" />
         </div>
         <p className="text-xs text-gray-500">Attached file</p>
       </div>
      
       <Button  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md"
       onClick={() => downloadAttachment(comment.attachmentUrl!)}
       disabled={isAttachmentLoading}
       >
         <Download className="h-3 w-3" /> Download
       </Button>
      
     </div> 
)}
   </div>
 </div>


  ))
)}


  </div>
)
};

export default Activity;


// const Comment = () => {
// return(
//   <div className="p-4 bg-white rounded-lg shadow-md border border-gray-300 space-y-4">


//   <div className="flex justify-between items-center">
//     <div className="flex items-center gap-2">
//       <Calendar color="#4B5563" size={24} />
//       <p className="text-slate-600 text-base font-medium">December 21, 2024</p>
//     </div>
  
//     <div className="flex items-center gap-2">
//       <Button variant="ghost" className="p-0 rounded-full bg-gray-200 hover:bg-gray-300">
//         <UserRound size={28} />
//       </Button>
//       <p className="text-black text-base font-semibold">Kirat</p>
//     </div>
//   </div>


//   <div className="space-y-2">
//     <div className="flex items-center justify-between">
//       <p className="font-semibold text-black text-lg">Comment</p>
//       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-gray-300">
//         <MoreHorizontal className="h-4 w-4" />
//       </Button>
//     </div>

//     <p className="text-gray-700 text-md leading-relaxed">
//      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam voluptates voluptatum exercitationem harum. Omnis inventore deserunt nemo ex laborum accusantium aperiam corrupti fugiat distinctio, odio dolor optio excepturi odit quam aliquam fugit voluptatem dignissimos aut et aspernatur ipsam! Fugiat, neque!
//     </p>

//     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//           <Paperclip className="h-4 w-4 text-blue-600" />
//         </div>
//         <p className="text-xs text-gray-500">Attached file</p>
//       </div>
//       <Button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md">
//         <Download className="h-3 w-3" /> Download
//       </Button>
//     </div>
//   </div>
// </div>
// )
// }