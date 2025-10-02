import  { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Camera, Edit2, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useSelector } from 'react-redux';
import type { RootState } from '../slices/store/store';
import type { UserProps } from '../slices/AuthSlice';
import { axiosInstance } from '../api/axios';
import { toast } from 'sonner';
import type { ApiResponse } from '../types/ApiResponse';
import type { AxiosError } from 'axios';


const  Profile = () =>  {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<UserProps | null>(null)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "", 
    newPassword: '',
    confirmPassword: ''
  });
const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
const [isUpdatingUserDetails, setIsUpdatingUserDetails] = useState<boolean>(false);




  const handleSave =  async () => {
    setIsEditing(false);
setIsUpdatingUserDetails(true)

    try { 
if(!profileData?.fullname?.trim()){
  return toast.error("Full name cannot be empty ")
}
      const response = await axiosInstance.patch<ApiResponse>('/update-user-details', {fullname: profileData?.fullname})

      if(response.data.success){
        toast.success(response.data.message)
      }

    } catch (error) {
    console.error("Error : ", error) 
      const axiosError  =  error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || "Something went wrong during update user details"
      toast.error(errorMessage)

    }finally{
      setIsUpdatingUserDetails(false)
 }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  const handlePasswordChange = async () => {

    setIsChangingPassword(true)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    
    if(!passwordRegex.test(passwordData.newPassword)){
     return toast.error("Password should be minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.")

    }
    
    if(passwordData.newPassword  !== passwordData.confirmPassword){
      return toast.error("New password and confirm password must be same.")
    }

    try {


      const payload = {
        oldPassword: passwordData.oldPassword,
         newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmPassword 
      }

const response = await  axiosInstance.patch<ApiResponse>("/change-password", payload)

if(response.data.success){
  toast.success(response.data.message)
}

setPasswordData({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
})

setShowPasswordModal(false)


} catch (error) {
      console.error(" Error : ", error)
const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || "Error during chnaging the password"
    toast.error(errorMessage)
    } finally{
      setIsChangingPassword(false)
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPasswordData({oldPassword: "",  newPassword: '', confirmPassword: '' });
  };

  const {user} = useSelector((state: RootState) => state.auth)

  useEffect(() => {

    if(!user) return
    setProfileData(user)

  }, [user])

  return (
  <DashboardLayout>
    {profileData ? 
    (
       <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

 
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                R
              </div>
              <Button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-700" />
              </Button>
            </div>
            
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">{profileData?.fullname}</h2>
            <p className="text-sm text-gray-500 mt-1">{profileData?.role.charAt(0).toUpperCase() + profileData?.role.slice(1, profileData?.role.length)}</p>
          </div>

          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                disabled={isUpdatingUserDetails}
                className="bg-transparent flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button 
                  onClick={handleCancel}
                  className="bg-transparent flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>


          <div className="space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-500 mb-2">Full Name</Label>
                {isEditing ? (
                  <Input 
                    type="text" 
                    value={profileData?.fullname}
                    onChange={(e) => setProfileData({...profileData, fullname: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{profileData.fullname}</p>
    
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-500 mb-2">Email Address</Label>
               
                  <p className="text-gray-900 text-lg">{profileData.email}</p>
                 
              </div>
            </div>

            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-500 mb-2">Role</Label>
                <p className="text-gray-900 text-lg">{profileData?.role.charAt(0).toUpperCase() + profileData?.role.slice(1, profileData?.role.length)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <Label className="block text-sm font-medium text-gray-500 mb-1">Password</Label>
                  <p className="text-gray-400 text-sm">••••••••</p>
                </div>
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-transparent px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
              <Button
                onClick={handleCloseModal}
                className="bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
             disabled={isChangingPassword}
             >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">

               <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </Label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter old password"
                      disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="bg-transparent hover:bg-transparent absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>


              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter new password"
                      disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="bg-transparent hover:bg-transparent absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Confirm new password"
                      disabled={isChangingPassword}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="bg-transparent hover:bg-transparent absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handlePasswordChange}
                disabled={
                 [passwordData.oldPassword, passwordData.newPassword, passwordData.confirmPassword]
                 .some(password => password.trim().length === 0) || isChangingPassword 
                }
                className="flex-1 px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
             
              >
                Update Password
              </Button>
              <Button
                onClick={handleCloseModal}
                className="bg-transparent flex-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              disabled={isChangingPassword}
            >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>

    ) 
    :
     (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
      <div className="text-center p-8 rounded-2xl shadow-lg bg-gray-900 border border-gray-700">
        <h1 className="text-3xl font-bold mb-3">User Details Not Found</h1>
        <p className="text-gray-400">
          Oops! Something went wrong while fetching the user details. <br />
          Please try again later.
        </p>
      </div>
    </div> 
     )
     }

  </DashboardLayout>
  );
}


export default Profile