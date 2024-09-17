import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { RiListUnordered } from "react-icons/ri";
import { IoIosReturnLeft } from "react-icons/io"

const navigation = [
  { name: 'Filter', href: '/home', current: true },
  { name: 'Calendar', href: '/calender', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ScedulerNav = () => {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
                <div className="flex flex-1 space-x-10 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className='flex flex-row p-2 rounded-3xl border hover:shadow-lg'>
                    <div className="flex flex-shrink-0 items-center">
                        {<IoIosReturnLeft className="w-auto h-6"/>}
                    </div>
                  </div>
                  <div className='flex flex-row p-2 rounded-3xl border hover:shadow-lg'>
                    <div className="flex flex-shrink-0 items-center">
                        {<RiListUnordered className="w-auto h-6"/>}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                  <img
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      className="h-8 w-auto"
                  />
                  </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt="User avatar"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="w-8 h-8 rounded-full"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-gray-300"
                  >
                    <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

export default ScedulerNav;
