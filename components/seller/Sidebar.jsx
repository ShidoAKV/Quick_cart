import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
        { name: 'Size Chart', path: '/seller/chartsize', icon: assets.menu_icon },
    ];

    return (
         <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300  flex flex-col bg-white  '>
            {menuItems?.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={`flex items-center py-3 px-4 md:px-4 gap-3 cursor-pointer transition-all ${
                                isActive
                                    ? 'border-r-4 md:border-r-[6px] bg-green-700/10 border-green-800/90'
                                    : 'hover:bg-gray-100/90 border-white'
                            }`}
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                width={24}
                                height={24}
                                className="min-w-[24px]"
                            />
                            <p className='hidden md:block truncate'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
