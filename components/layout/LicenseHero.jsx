export default function LicenseHero({ user, isLoading }) {
  return (
    <div className="py-8">
      <div className="flex justify-center sm:justify-start">
        <div className="">
          <div className="flex flex-row items-center justify-center">
            <div className="flex-0 mr-4 sm:mr-5 -ml-8 sm:-ml-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28-- lg:h-28-- border-2 border-white rounded-full bg-gray-100 shadow-sm">
                {user && user.license.logoUrl && (
                  <img
                    id="licenseLogo"
                    src={user.license.logoUrl}
                    width='100%'
                    height='100%'
                    className="w-full h-full object-contain rounded-full"
                  />
                )}
              </div>
            </div>
            <div className="flex-0 md:flex-grow">
              {isLoading && <>
                <div className="text-xs text-gray-400 leading-tight uppercase md:mb-1">
                  ACES License Type
                </div>
                <div className="license-name text-2xl sm:text-3xl lg:text-4xl--- text-gray-400 leading-snug tracking-tight">
                  License Name
                </div>
                <div className="text-xs text-gray-400 md:mt-1">
                  Expiry Date
                </div>
              </>}
              {user && <>
                <div className="text-xs text-gray-500 leading-tight uppercase md:mb-1">
                  Aces {user.license.type} License
                </div>
                <div className="license-name text-2xl sm:text-3xl lg:text-4xl--- text-gray-800 leading-snug tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500">
                    {user.license.title}
                  </span>
                </div>
                <div className="text-xs text-gray-600 md:mt-1">
                  {/* {user.licenseExpiryDate.substr(0, 10)} */} XXX
                </div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}