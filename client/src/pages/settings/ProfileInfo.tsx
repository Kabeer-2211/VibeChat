import { Separator } from "@/components/ui/separator"

import ChangePassword from '@/pages/settings/ChangePassword';
import UpdateProfileInfo from "./UpdateProfileInfo";

const ProfileInfo = () => {
    return (
        <div className='px-10'>
            <UpdateProfileInfo />
            <Separator />
            <ChangePassword />
        </div>
    )
}

export default ProfileInfo