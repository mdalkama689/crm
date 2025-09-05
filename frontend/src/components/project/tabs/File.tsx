import { useSelector } from "react-redux";
import type { RootState } from "../../../slices/store/store";
import { axiosInstance } from "../../../api/axios";
import { useEffect } from "react";

const File = () => {

  const obj = [
    {
      name: "alkama"
    }, 
    {
      name: "pankaj"
    }, 
    {
      name: "khushi"
    }, 
    {
      name: "gunjan"
    }, 
    {
      name: "rupal"
    }, 
  ]


  const newOne = "alkama"

  const combine = [...obj, {name: newOne}]
  console.log(combine)
  const {project} =  useSelector((state: RootState) => state.project)

  if(!project) return

  const fetchAllFiles = async () => {
    try {
    console.log('start')
      const response = await axiosInstance.get(`/projects/${project.id}/files`)
    console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
if(!project) return

fetchAllFiles() 
  }, [project.id])

  return <div>File</div>;
};

export default File;
