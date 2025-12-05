export const userData = [
    { id: '29506', name: 'Leslie Alexander', email: 'oxheart@email.com', status: 'Unverified', plan: 'Premium' },
    { id: '29505', name: 'Marvin McKinney', email: 'mountain@email.com', status: 'Pending', plan: '-' },
    { id: '29504', name: 'Kristin Watson', email: 'juniper@email.com', status: 'Inactive', plan: 'Premium' },
    { id: '29503', name: 'Ralph Edwards', email: 'mountain@email.com', status: 'Verified', plan: 'Premium' },
    { id: '29502', name: 'Darrell Steward', email: 'oxheart@email.com', status: 'Pending', plan: '-' },
    { id: '29501', name: 'Theresa Webb', email: 'juniper@email.com', status: 'Active', plan: 'Premium' },
    { id: '29500', name: 'Eleanor Pena', email: 'oxheart@email.com', status: 'Active', plan: 'Free' },
    { id: '29499', name: 'Kathryn Murphy', email: 'mountain@email.com', status: 'Verified', plan: 'Premium' },
    { id: '29498', name: 'Esther Howard', email: 'juniper@email.com', status: 'Verified', plan: 'Premium' }
];

export const getUserById = (id) => {
    return userData.find(user => user.id === id);
};
