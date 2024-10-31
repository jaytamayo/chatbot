import { useLoaderData } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
// import { useTranslation } from 'react-i18next';
import { ResponseGetType } from '~/types/common';
import { loader } from '~/app/routes/_index';

export const useFetchUserInfo = (): ResponseGetType<IUserInfo> => {
  const loaderData = useLoaderData<typeof loader>();

  // const { i18n } = useTranslation();

  const { data, isFetching: loading } = useQuery({
    queryKey: ['userInfo'],
    initialData: {},
    gcTime: 0,
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:9380/v1/user/info', {
        method: 'GET',
        headers: {
          Authorization: loaderData?.authorization,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // if (data.retcode === 0) {
      //   i18n.changeLanguage(
      //     LanguageTranslationMap[
      //       data.data.language as keyof typeof LanguageTranslationMap
      //     ]
      //   );
      // }
      return data?.data ?? {};
    },
  });

  return { data, loading };
};

export interface IUserInfo {
  access_token: string;
  avatar?: any;
  color_schema: string;
  create_date: string;
  create_time: number;
  email: string;
  id: string;
  is_active: string;
  is_anonymous: string;
  is_authenticated: string;
  is_superuser: boolean;
  language: string;
  last_login_time: string;
  login_channel: string;
  nickname: string;
  password: string;
  status: string;
  update_date: string;
  update_time: number;
}
