import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

import ProfileList from '@/views/ProfileList'
import ProfileDetail from '@/views/ProfileDetail'
import YachtList from '@/views/YachtList'

// Agreements
import AgreementList from '@/views/AgreementList'
// Agreements Sections
import QuickViewSection from '@/views/AgreementDetail/sections/QuickView/QuickViewSection'
import ContractSection from '@/views/AgreementDetail/sections/ContractSection'
import YachtSection from '@/views/AgreementDetail/sections/YachtSection'
import MappingSection from '@/views/AgreementDetail/sections/MappingSection'
import ClientsSection from '@/views/AgreementDetail/sections/ClientsSection'
import BrokersSection from '@/views/AgreementDetail/sections/BrokersSection'
// Auth
import Authentication from '@/views/Authentication'
import RegistrationForm from '@/components/forms/auth/RegistrationForm'
import LoginForm from '@/components/forms/auth/LoginForm'
// Yacht
import YachtCreate from '@/views/YachtDetail/YachtCreate'
// contacts
import ContactsList from '@/views/ContactsList'
import ContactDetail from '@/views/ContactDetail/ContactDetail'

const AgreementDetail = () => import('@/views/AgreementDetail/AgreementDetail')

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/authentication',
    component: Authentication,
    redirect: { name: 'Login' },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginForm
      },
      {
        path: 'registration',
        name: 'Registration',
        component: RegistrationForm
      }
    ]
  },
  {
    path: '/agreement',
    name: 'AgreementList',
    component: AgreementList
  },
  {
    path: '/agreement/:cruiseId',
    component: AgreementDetail,
    children: [
      {
        path: '',
        name: 'AgreementDetail',
        component: QuickViewSection
      },
      {
        path: 'contract',
        name: 'ContractSection',
        component: ContractSection
      },
      {
        path: 'yacht',
        name: 'YachtSection',
        component: YachtSection
      },
      {
        path: 'mapping',
        name: 'MappingSection',
        component: MappingSection
      },
      {
        path: 'clients',
        name: 'ClientsSection',
        component: ClientsSection
      },
      {
        path: 'brokers',
        name: 'BrokersSection',
        component: BrokersSection
      }
    ]
  },
  {
    path: '/profile',
    name: 'ProfileList',
    component: ProfileList,
    children: [
      {
        path: 'create',
        name: 'ProfileCreate',
        component: ProfileDetail
      },
      {
        path: ':profileId',
        name: 'ProfileDetail',
        component: ProfileDetail
      }
    ]
  },
  {
    path: '/yachts',
    name: 'YachtList',
    component: YachtList
  },
  {
    path: '/yachts/create',
    name: 'YachtCreate',
    component: YachtCreate
  },
  {
    path: '/contacts',
    name: 'ContactsList',
    component: ContactsList
  },
  {
    path: '/contacts/:id',
    name: 'ContactDetail',
    component: ContactDetail,
    props: true
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default new Router({
  mode: 'history',
  routes
})
