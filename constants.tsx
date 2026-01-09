
import { Business, Employee, User, UserRole } from './types';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    ownerId: 'u2',
    name: 'The Sharp Blade Barbers',
    description: 'Premium grooming for the modern gentleman. We specialize in classic cuts and hot towel shaves.',
    category: 'Barber',
    address: '123 Style Ave, New York, NY',
    logo: 'https://picsum.photos/seed/barber/200/200',
    rating: 4.8
  },
  {
    id: 'b2',
    ownerId: 'u3',
    name: 'Glow Up Spa',
    description: 'Rejuvenate your skin and soul with our luxury facials and massage therapy.',
    category: 'Spa & Wellness',
    address: '456 Serenity Dr, Los Angeles, CA',
    logo: 'https://picsum.photos/seed/spa/200/200',
    rating: 4.9
  },
  {
    id: 'b3',
    ownerId: 'u4',
    name: 'Iron Forge Fitness',
    description: 'Personal training and group sessions focused on strength and longevity.',
    category: 'Fitness',
    address: '789 Muscle Rd, Chicago, IL',
    logo: 'https://picsum.photos/seed/gym/200/200',
    rating: 4.7
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', businessId: 'b1', name: 'James Wilson', role: 'Master Barber', avatar: 'https://i.pravatar.cc/150?u=e1' },
  { id: 'e2', businessId: 'b1', name: 'Sarah Miller', role: 'Stylist', avatar: 'https://i.pravatar.cc/150?u=e2' },
  { id: 'e3', businessId: 'b2', name: 'Elena Rodriguez', role: 'Esthetician', avatar: 'https://i.pravatar.cc/150?u=e3' },
  { id: 'e4', businessId: 'b3', name: 'Marcus Kane', role: 'Head Coach', avatar: 'https://i.pravatar.cc/150?u=e4' }
];

export const CATEGORIES = ['All', 'Barber', 'Spa & Wellness', 'Fitness', 'Medical', 'Beauty'];
