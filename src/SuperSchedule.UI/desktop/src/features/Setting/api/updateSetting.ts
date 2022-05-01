import { axios } from "../../../lib/axios";
import { Setting } from "../components/Setting";

type UpdateSettingOptions = {
  setting: Setting;
};

export const updateSetting = ({ setting }: UpdateSettingOptions) => {
  return axios.post("/settings/UpdateSettings", setting);
};
