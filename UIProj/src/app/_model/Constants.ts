import { menuPermission } from './user.model';

export class Constants {
  public static readonly PAGE_SIZE = [5, 10, 20, 50, 100];
  public static readonly MENUPERMISSION: menuPermission = {
    code: '',
    name: '',
    haveview: false,
    haveadd: false,
    haveedit: false,
    havedelete: false,
    userrole: '',
    menucode: '',
  };
}
