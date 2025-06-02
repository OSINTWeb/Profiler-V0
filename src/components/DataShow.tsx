import React from "react";

const DataSection = ({ title, children, icon }) => (
  <div className="bg-black rounded-xl shadow-sm p-6 mb-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
      {icon && <div className="mr-3 text-blue-500 text-2xl">{icon}</div>}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const DataItem = ({ label, value, isLink = false }) => {
  if (!value && value !== 0 && value !== false) return null;

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-md font-medium text-white mb-1">{label}</div>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-200 hover:underline break-all hover:text-blue-800 transition-colors duration-150"
        >
          {value}
        </a>
      ) : (
        <div className="text-white break-all">
          {typeof value === "boolean" ? value.toString() : value}
        </div>
      )}
    </div>
  );
};

const DataList = ({ label, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-3 last:mb-0">
      <div className="text-md font-medium text-white mb-1">{label}</div>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-white">
            {typeof item === "object" ? (
              <div className="ml-2">
                {Object.entries(item).map(([key, val]) => (
                  <DataItem key={key} label={key} value={val} />
                ))}
              </div>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserProfileCard = ({ data }) => {
  if (!data) return <div className="p-4 text-center text-white">No data available</div>;

  const {
    hibp,
    gravatar,
    trello,
    notion,
    adobe,
    linkedin,
    goodreads,
    social_media_checker,
    ghunt,
  } = data;

  const gravatarProfile = gravatar?.entry?.[0];
  const linkedinProfile = linkedin?.persons?.[0];
  const ghuntProfile = ghunt?.PROFILE_CONTAINER?.profile;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4 overflow-hidden">
          {gravatarProfile?.thumbnailUrl ? (
            <img
              src={gravatarProfile.thumbnailUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {gravatarProfile?.displayName || linkedinProfile?.displayName || "User Profile"}
        </h1>
        <p className="text-white max-w-2xl mx-auto">
          {gravatarProfile?.aboutMe || linkedinProfile?.headline}
        </p>
      </div>

      {/* Personal Information */}
      <DataSection title="Personal Information" icon="👤">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DataItem label="Name" value={gravatarProfile?.displayName} />
            <DataItem
              label="Location"
              value={gravatarProfile?.currentLocation || linkedinProfile?.location}
            />
            <DataItem
              label="Job Title"
              value={
                gravatarProfile?.job_title ||
                linkedinProfile?.positions?.positionHistory?.[0]?.title
              }
            />
            <DataItem
              label="Company"
              value={gravatarProfile?.company || linkedinProfile?.companyName}
            />
          </div>
          <div>
            <DataItem
              label="Primary Email"
              value={gravatarProfile?.emails?.[0]?.value || linkedinProfile?.emails?.[0]}
              isLink
            />
            <DataItem label="Trello Email" value={trello?.[0]?.email} isLink />
            <DataItem label="Notion Email" value={notion?.value?.value?.email} isLink />
          </div>
        </div>
      </DataSection>

      {/* Social Media */}
      <DataSection title="Social Media" icon="🌐">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DataList
              label="Accounts"
              items={gravatarProfile?.accounts?.map((acc) => ({
                [acc.name]: acc.url,
              }))}
            />
          </div>
          <div>
            <DataItem label="LinkedIn" value={linkedinProfile?.linkedInUrl} isLink />
            <DataItem label="Goodreads" value={goodreads?.profiles?.[0]} isLink />
            <DataItem label="Gravatar Profile" value={gravatarProfile?.profileUrl} isLink />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-medium text-white mb-2">Social Media Presence</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(social_media_checker || {}).map(([platform, info]) => (
              <div
                key={platform}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  info.live
                    ? "bg-green-100 text-black hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                } transition-colors duration-150`}
              >
                {platform}: {info.live ? "✓ Active" : "✗ Inactive"}
              </div>
            ))}
          </div>
        </div>
      </DataSection>

      {/* HIBP Breach Data */}
      {hibp?.length > 0 && (
        <DataSection title="Breach Information" icon="⚠️">
          <div className="space-y-6">
            {hibp.map((breach, index) => (
              <div
                key={index}
                className="p-4 bg-gray-950 hover:bg-gray-900 text-white rounded-lg hover:bg-gray-900 transition-colors duration-150"
              >
                <div className="flex items-start mb-3">
                  {breach.LogoPath && (
                    <img
                      src={breach.LogoPath}
                      alt={breach.Name}
                      className="w-12 h-12 mr-3 object-contain bg-black p-1 rounded"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-2xl">{breach.Name}</h4>
                    <p className="text-md text-white">
                      Breach date: {breach.BreachDate} • {breach.PwnCount.toLocaleString()} accounts
                      affected
                    </p>
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: breach.Description }}
                  className="prose max-w-none text-white mb-3 text-md"
                />
                <DataList label="Compromised Data" items={breach.DataClasses} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  <div
                    className={`px-2 py-1 rounded text-xs text-center font-medium ${
                      breach.IsVerified ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-blue-800"
                    }`}
                  >
                    Verified: {breach.IsVerified ? "✓" : "✗"}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs text-center font-medium ${
                      breach.IsSensitive ? "bg-red-100 text-red-800" : "bg-gray-100 text-red-800"
                    }`}
                  >
                    Sensitive: {breach.IsSensitive ? "✓" : "✗"}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs text-center font-medium ${
                      breach.IsRetired ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-yellow-800"
                    }`}
                  >
                    Retired: {breach.IsRetired ? "✓" : "✗"}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs text-center font-medium ${
                      breach.IsMalware ? "bg-red-100 text-red-800" : "bg-gray-100 text-red-800"
                    }`}
                  >
                    Malware: {breach.IsMalware ? "✓" : "✗"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataSection>
      )}

      {/* LinkedIn Details */}
      {linkedinProfile && (
        <DataSection title="Professional Profile" icon="💼">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-3 text-2xl">Summary</h4>
              <p className="text-white whitespace-pre-line bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
                {linkedinProfile.summary}
              </p>

              <h4 className="font-semibold mt-6 mb-3 text-2xl">Experience</h4>
              <div className="space-y-4">
                {linkedinProfile.positions?.positionHistory?.map((position, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-950 hover:bg-gray-900 text-white rounded-lg hover:bg-gray-900 transition-colors duration-150"
                  >
                    <div className="flex items-start">
                      {position.companyLogo && (
                        <img
                          src={position.companyLogo}
                          alt={position.companyName}
                          className="w-12 h-12 mr-3 object-contain bg-black p-1 rounded"
                        />
                      )}
                      <div>
                        <h5 className="font-medium text-white">{position.title}</h5>
                        <p className="text-md text-white">{position.companyName}</p>
                        <p className="text-xs text-white mt-1">
                          {position.startEndDate.start.month}/{position.startEndDate.start.year} -{" "}
                          {position.startEndDate.end.month
                            ? `${position.startEndDate.end.month}/${position.startEndDate.end.year}`
                            : "Present"}
                          {position.duration && ` • ${position.duration}`}
                        </p>
                      </div>
                    </div>
                    {position.description && (
                      <p className="text-white mt-3 text-md whitespace-pre-line">
                        {position.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-2xl">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {linkedinProfile.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md hover:bg-blue-200 transition-colors duration-150"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-3 text-2xl">Education</h4>
                <div className="space-y-3">
                  {linkedinProfile.schools?.educationHistory?.map((edu, index) => (
                    <div key={index} className="pb-3 border-b border-gray-200 last:border-0">
                      <h5 className="font-medium text-white">{edu.schoolName}</h5>
                      <p className="text-md text-white">{edu.degreeName}</p>
                      <p className="text-xs text-white mt-1">
                        {edu.startEndDate.start.month}/{edu.startEndDate.start.year} -{" "}
                        {edu.startEndDate.end.month}/{edu.startEndDate.end.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DataSection>
      )}
      <div>
        {ghuntProfile && (
          <DataSection title="Google Profile" icon="🔍">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {ghuntProfile?.names?.PROFILE?.fullname ||
                  gravatarProfile?.displayName ||
                  linkedinProfile?.displayName ||
                  "User Profile"}
              </h1>
              <p className="text-white max-w-2xl mx-auto">
                {gravatarProfile?.aboutMe || linkedinProfile?.headline}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <DataItem
                  label="Profile Photo"
                  value={
                    ghuntProfile.profilePhotos?.PROFILE?.url && (
                      <a
                        href={ghuntProfile.profilePhotos.PROFILE.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-200 hover:underline"
                      >
                        View Image
                      </a>
                    )
                  }
                />
                <DataItem
                  label="Cover Photo"
                  value={
                    ghuntProfile.coverPhotos?.PROFILE?.url && (
                      <a
                        href={ghuntProfile.coverPhotos.PROFILE.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-200 hover:underline"
                      >
                        View Cover
                      </a>
                    )
                  }
                />
                <DataItem label="Email" value={ghuntProfile.emails?.PROFILE?.value} isLink />
                <DataItem
                  label="User Type"
                  value={ghuntProfile.profileInfos?.PROFILE?.userTypes?.join(", ")}
                />
                <DataItem
                  label="Last Updated"
                  value={ghuntProfile.sourceIds?.PROFILE?.lastUpdated}
                />
              </div>
              <div>
                <DataList
                  label="Available Apps"
                  items={ghuntProfile.inAppReachability?.PROFILE?.apps}
                />
                <div className="mt-4">
                  <h4 className="text-md font-medium text-white mb-2">Presence</h4>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ghuntProfile.extendedData?.dynamiteData?.dndState === "AVAILABLE"
                          ? "bg-green-100 text-black"
                          : "bg-gray-100 text-white"
                      }`}
                    >
                      Status: {ghuntProfile.extendedData?.dynamiteData?.dndState || "UNKNOWN"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ghuntProfile.extendedData?.gplusData?.isEntrepriseUser
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ghuntProfile.extendedData?.gplusData?.isEntrepriseUser
                        ? "Enterprise User"
                        : "Regular User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Activity */}
            {ghunt?.PROFILE_CONTAINER?.maps && (
              <div className="mt-6">
                <h4 className="font-semibold text-2xl mb-3">Google Maps Activity</h4>
                {ghunt.PROFILE_CONTAINER.maps.failed === "private" ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-md text-yellow-700">
                          This user's Google Maps activity is private.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(ghunt.PROFILE_CONTAINER.maps.stats || {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-950 hover:bg-gray-900 text-white p-3 rounded-lg text-center hover:bg-gray-900 transition-colors duration-150"
                        >
                          <div className="text-2xl font-bold text-white">{value}</div>
                          <div className="text-xs text-white mt-1">{key}</div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Play Games and Calendar - Show if data exists */}
            {(ghunt?.PROFILE_CONTAINER?.play_games || ghunt?.PROFILE_CONTAINER?.calendar) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Google Play Games</h4>
                  {ghunt.PROFILE_CONTAINER.play_games ? (
                    <p className="text-white">Data available</p>
                  ) : (
                    <p className="text-white text-md">No Play Games data available</p>
                  )}
                </div>
                <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Google Calendar</h4>
                  {ghunt.PROFILE_CONTAINER.calendar ? (
                    <p className="text-white">Data available</p>
                  ) : (
                    <p className="text-white text-md">No Calendar data available</p>
                  )}
                </div>
              </div>
            )}
          </DataSection>
        )}
      </div>

      {/* Other Services */}
      <DataSection title="Other Services" icon="🛠️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-2xl">Trello</h4>
            {trello?.[0] ? (
              <>
                <DataItem label="Username" value={trello[0].username} />
                <DataItem label="Full Name" value={trello[0].fullName} />
                <DataItem
                  label="Last Active"
                  value={new Date(trello[0].dateLastActive).toLocaleString()}
                />
              </>
            ) : (
              <p className="text-white text-md">No Trello data available</p>
            )}
          </div>

          <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-2xl">Notion</h4>
            {notion?.value?.value ? (
              <>
                <DataItem label="Name" value={notion.value.value.name} />
                <DataItem label="Profile Photo" value={notion.value.value.profile_photo} isLink />
              </>
            ) : (
              <p className="text-white text-md">No Notion data available</p>
            )}
          </div>

          <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-2xl">Adobe</h4>
            {adobe?.[0] ? (
              <>
                <DataItem
                  label="Status"
                  value={
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        adobe[0].status.code === "active"
                          ? "bg-green-100 text-black"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {adobe[0].status.code}
                    </span>
                  }
                />
                <DataList
                  label="Authentication Methods"
                  items={adobe[0].authenticationMethods?.map((method) => method.id)}
                />
              </>
            ) : (
              <p className="text-white text-md">No Adobe data available</p>
            )}
          </div>

          <div className="bg-gray-950 hover:bg-gray-900 text-white p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-2xl">Goodreads</h4>
            {goodreads?.username?.[0] ? (
              <>
                <DataItem label="Username" value={goodreads.username[0]} />
                <DataItem label="Profile" value={goodreads.profiles?.[0]} isLink />
                <DataItem label="Location" value={goodreads.location?.[0]} />
              </>
            ) : (
              <p className="text-white text-md">No Goodreads data available</p>
            )}
          </div>

          {/* Google Profile (GHunt) */}
        </div>
      </DataSection>
    </div>
  );
};

export default UserProfileCard;
