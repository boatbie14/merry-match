import React from "react";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const { userInfo, isLoggedIn } = useAuth();
  const isAuthenticated = userInfo !== null || isLoggedIn;

  return (
    <div className=" flex  justify-center items-center bg-[#160404] ">
      <div className="m-auto w-full max-w-[1440px] ">
        <section className=" md:h-[758px] overflow-hidden mt-20 pt-80 md:pt-44 pb-20 bg-[#160404] ">
          <div className="container mx-auto px-6 relative">
            {/* Decorative Elements */}
            <div className="absolute w-[67px] h-[67px] top-[-60px] left-[-130px] bg-[#532341] rounded-full"></div>
            <div className="absolute w-2 h-2 top-[360px] right-[70px] bg-[#7B4429] rounded-full"></div>
            <div className="absolute w-[7px] h-[7px] top-[-70px] left-[30px] bg-[#FFB1C8] rounded-full"></div>

            <div className="flex flex-col  items-center justify-center text-center ">
              <div className="max-w-xl w-[358px] relative z-10">
                <h1 className="text-6xl font-black text-white leading-tight mb-6">
                  Make the <br />
                  first &apos;Merry&apos;
                </h1>
                <p className="text-xl text-white mb-12">
                  If you feel lonely, let&apos;s start meeting new people in
                  your area! <br />
                  Don&apos;t forget to get Merry with us
                </p>
                {isAuthenticated ? (
                  <Link
                    href="/matching"
                    className="bg-[#C70039] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#950028] transition-colors"
                  >
                    Start matching!
                  </Link>
                ) : (
                  <Link
                    href="/matching"
                    className="bg-[#C70039] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#950028] transition-colors"
                  >
                    Start matching!
                  </Link>
                )}
              </div>

              {/* Profile Images with Chat Bubbles */}
              <div className="Hero-profile relative w-1/2 h-[600px]  ">
                <div>
                  <div className="First-Profile absolute left-[-210px] bottom-[920px]  md:left-[550px] md:bottom-[760px] w-[286px] h-[500px] rounded-[999px] bg-gray-50 overflow-hidden">
                    <Image
                      src="/images/image-1.png"
                      alt="Profile1"
                      width={286}
                      height={500}
                      className="w-full h-full object-cover rounded-[999px]"
                    />
                  </div>
                  <div className="absolute bottom-[980px] right-[190px] w-[160px] md:bottom-[820px] md:right-[-275px] bg-[#64001D] text-white p-3 rounded-[24px_24px_24px_0px] text-sm font-semibold">
                    Hi! Nice to meet you
                  </div>
                </div>

                <div>
                  <div className=" Second-Profile absolute right-[-210px] bottom-[10px]  md:right-[510px] md:bottom-[360px] w-[286px] h-[500px] rounded-[999px] bg-gray-200 overflow-hidden">
                    <Image
                      src="/images/image-2.png"
                      alt="Profile2"
                      width={286}
                      height={500}
                      className="w-full h-full object-cover rounded-[999px] grayscale "
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute flex flex-row w-[180px] bottom-[-180px] left-[170px] md:bottom-[150px] md:left-[-230px] bg-[#64001D] text-white p-3 rounded-[24px_24px_0px_24px] text-sm font-semibold">
                      <svg
                        className="mr-2"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.73534 9.22569L7.73187 9.22615L7.72041 9.22661C7.65323 9.22905 7.58604 9.23054 7.51888 9.23108C6.70945 9.2342 5.90473 9.15349 5.11807 8.9903C3.72123 8.6949 2.03873 8.03119 1.16671 6.5208C0.516029 5.39379 0.984887 3.93141 2.17361 3.2451C2.50316 3.05276 2.87026 2.93442 3.24761 2.89888C3.62495 2.86335 4.00283 2.91154 4.35314 3.03986C4.41717 2.67225 4.56443 2.32083 4.78395 2.01177C5.00346 1.7027 5.2896 1.44393 5.62105 1.25472C6.80937 0.568643 8.31026 0.893788 8.96094 2.0208C9.83319 3.53158 9.56673 5.32052 9.12368 6.67715C8.8717 7.44001 8.53924 8.17727 8.1318 8.8767C8.09783 8.93472 8.06302 8.99229 8.02738 9.04938L8.02126 9.05907L8.01935 9.06223L8.01837 9.0633C7.98779 9.11044 7.94616 9.14988 7.89711 9.1782C7.84807 9.20652 7.79309 9.22285 7.73698 9.22577L7.73556 9.22607L7.73534 9.22569Z"
                          fill="#F4EBF2"
                        />
                      </svg>
                      Nice to meet you too!
                    </div>
                  </div>
                </div>

                <div className="absolute w-[60px] h-[60px] top-[-100px] right-[-355px] bg-[#320000] rounded-full">
                  <div className="relative">
                    <div className="absolute top-[30px] left-[-15px]">
                      <Image
                        src="/images/smile-emoji.png"
                        alt="smile-emoji"
                        width={28}
                        height={28}
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Merry Match Section */}
        <section id="WhyMerryMatch" className="  m-auto py-20 bg-[#160404]  ">
          <div className="container flex  md:flex-row m-auto mx-auto px-6">
            <div className="flex flex-col xl:flex-row  lg:flex-col items-center justify-center w-full">
              <div className="max-w-xl">
                <h2 className="text-5xl font-extrabold text-[#DF89C6] mb-10">
                  Why Merry Match?
                </h2>
                <p className="text-white text-xl mb-6">
                  Merry Match is a new generation of online dating website for
                  everyone
                </p>
                <p className="text-[#F6F7FC] text-base leading-relaxed">
                  Whether you&apos;re committed to dating, meeting new people,
                  expanding your social network, meeting locals while traveling,
                  or even just making a small chat with strangers.
                  <br />
                  <br />
                  This site allows you to make your own dating profile, discover
                  new people, save favorite profiles, and let them know that
                  you&apos;re interested
                </p>
              </div>
              <div className="merry-match-card flex ml-10 lg:ml-40 xl:ml-20 md:pl-10 pl-0 lg:pt-20  pt-32 m-auto w-1/2  ">
                <div className="relative h-[324px]">
                  <div className="absolute top-0 left-[70px] w-[237px] h-[99px] bg-[#7D2262] rounded-[29px] drop-shadow-2xl z-10 p-6">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-5 h-5 rounded">
                        <svg
                          width="19"
                          height="17"
                          viewBox="0 0 19 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.9874 5.38336L12.8015 5.55408C9.86667 8.24833 5.52852 8.74071 2.06453 6.77273V6.77273C1.23174 6.29945 1.40497 5.15043 2.34695 4.90021L16.1472 1.22926C17.0098 0.999619 17.8092 1.73216 17.5529 2.51821L13.4702 15.0447C13.1905 15.9015 11.9327 16.0546 11.4166 15.2949L7.87427 10.0758"
                            stroke="white"
                            stroke-width="1.36865"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-xl font-bold">Fast</span>
                      <div className="relative">
                        <svg
                          className="absolute top-[-37px] left-[40px] "
                          width="97"
                          height="76"
                          viewBox="0 0 97 76"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M95.1814 44.1779C95.7353 43.8731 96.1965 43.4241 96.5162 42.8786C96.8359 42.3331 97.0021 41.7113 96.9974 41.0791C96.9926 40.4468 96.8171 39.8276 96.4892 39.287C96.1614 38.7463 95.6935 38.3044 95.1351 38.0078L60.9549 19.9109L32.7959 48.0698C32.1382 48.7275 31.2462 49.097 30.316 49.097C29.3858 49.097 28.4938 48.7275 27.836 48.0698C27.1783 47.4121 26.8088 46.52 26.8088 45.5898C26.8088 44.6597 27.1783 43.7676 27.8361 43.1099L55.995 14.951L37.898 -19.2293C37.6015 -19.7877 37.1595 -20.2556 36.6189 -20.5834C36.0782 -20.9112 35.459 -21.0868 34.8268 -21.0915C34.1945 -21.0963 33.5727 -20.93 33.0272 -20.6103C32.4817 -20.2907 32.0328 -19.8295 31.7279 -19.2755C16.2158 8.95829 5.63809 39.6334 0.45086 71.4275C0.36101 71.9767 0.403135 72.5394 0.573745 73.0691C0.744364 73.5988 1.03858 74.0803 1.43207 74.4738C1.82557 74.8673 2.30705 75.1615 2.83674 75.3321C3.36642 75.5027 3.9291 75.5448 4.47829 75.455C36.2725 70.2679 66.9476 59.6903 95.1814 44.1779Z"
                            fill="#CF4FA9"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[87px] left-0 w-[398px] h-[109px] bg-[#DF89C6] rounded-[29px] p-6 flex items-center ">
                    <div className="flex items-center gap-2 text-[#7D2262] ">
                      <div className="SVG-secure relative mr-60  ">
                        <svg
                          className=" absolute top-[-27px] left-[20px]"
                          width="98"
                          height="82"
                          viewBox="0 0 98 82"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M51.7141 1.54229C51.0239 0.886092 50.1091 0.520325 49.1581 0.520325C48.2071 0.520325 47.2923 0.886092 46.6021 1.54229C36.0871 11.5568 22.0828 17.0484 7.58328 16.8431C6.79336 16.8328 6.02074 17.0753 5.3776 17.5354C4.73446 17.9955 4.2543 18.6492 4.00684 19.4015C1.91633 25.791 0.854516 32.4737 0.861361 39.1982C0.861361 68.7169 20.9924 93.5113 48.2318 100.541C48.8394 100.698 49.4768 100.698 50.0844 100.541C77.3238 93.5113 97.4548 68.7169 97.4548 39.1982C97.4548 32.293 96.3502 25.6361 94.3093 19.4015C94.0627 18.6482 93.5829 17.9935 92.9397 17.5324C92.2965 17.0714 91.5234 16.8282 90.7329 16.8382L90.0246 16.8431C75.1838 16.8431 61.7053 11.0308 51.7141 1.54229ZM67.0403 41.3642C67.3375 40.967 67.5525 40.5143 67.6728 40.0326C67.793 39.5509 67.816 39.0499 67.7405 38.5592C67.6649 38.0684 67.4923 37.5977 67.2327 37.1748C66.9732 36.752 66.632 36.3854 66.2292 36.0966C65.8263 35.8078 65.37 35.6028 64.887 35.4934C64.404 35.384 63.9041 35.3726 63.4167 35.4598C62.9292 35.547 62.464 35.731 62.0485 36.001C61.633 36.2711 61.2755 36.6217 60.997 37.0323L44.9674 59.5364L36.9229 51.4687C36.2187 50.8106 35.2872 50.4523 34.3247 50.4693C33.3622 50.4864 32.4439 50.8774 31.7632 51.56C31.0826 52.2427 30.6927 53.1636 30.6757 54.1289C30.6587 55.0941 31.016 56.0283 31.6722 56.7346L42.8176 67.9122C43.199 68.2943 43.6587 68.5887 44.1649 68.7748C44.6711 68.9609 45.2116 69.0343 45.7489 68.9898C46.2862 68.9454 46.8074 68.7842 47.2764 68.5175C47.7454 68.2508 48.1508 67.8848 48.4646 67.4452L67.0403 41.3642Z"
                            fill="#EFC4E2"
                          />
                        </svg>
                      </div>
                      <div className="w-5 h-5 rounded">
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.2389 12.323C2.96311 17.8238 12.2939 17.8238 14.0181 12.323C14.2043 11.7289 14.3109 11.0812 14.3109 10.3767C14.3109 4.79791 14.5531 4.36241 14.0174 3.82586C13.4808 3.28932 8.50475 1.55426 7.62851 1.55426C6.75227 1.55426 1.77617 3.28932 1.2405 3.82586C0.703956 4.36241 0.946097 4.79791 0.946097 10.3767C0.946097 11.0812 1.05267 11.7289 1.2389 12.323Z"
                            stroke="#7D2262"
                            stroke-width="1.36865"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5.3645 9.50193V9.50193C6.27436 10.4132 7.75095 10.4136 8.6613 9.50282L10.4077 7.75555"
                            stroke="#7D2262"
                            stroke-width="1.36865"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-xl font-bold">Secure</span>
                      <div className="relative">
                        <div className="absolute w-2.5 h-2.5 bg-[#612F16] rounded-full left-[90px] bottom-[110px] "></div>
                        <div className="absolute bg-amber-300 w-[60px] h-[60px] rounded-full top-[-100px] left-[-10px] ">
                          <Image
                            src="/images/boy.png"
                            alt="boy"
                            width={60}
                            height={60}
                            className="  w-[60px] h-[60px] rounded-full object-cover object-top grayscale "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[178px] left-[171px] w-[328px] h-[146px] bg-[#EFC4E2] drop-shadow-2xl rounded-[29px] p-6 flex items-end">
                    <div className="flex flex-row gap-2 text-end   text-[#C70039]">
                      <div className="w-5 h-5 rounded pt-1.5">
                        <svg
                          width="19"
                          height="18"
                          viewBox="0 0 19 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.4153 1.70528L12.0827 5.03635C12.2461 5.36336 12.5615 5.59012 12.9273 5.64259L16.6573 6.1795C17.5789 6.31256 17.9456 7.42947 17.2787 8.06945L14.5814 10.6612C14.3163 10.9161 14.1956 11.2825 14.2584 11.6423L14.8949 15.3013C15.0517 16.2064 14.0883 16.897 13.2646 16.4688L9.93073 14.74C9.6039 14.5704 9.21247 14.5704 8.88469 14.74L5.55085 16.4688C4.72713 16.897 3.76375 16.2064 3.92146 15.3013L4.55707 11.6423C4.61977 11.2825 4.49911 10.9161 4.23404 10.6612L1.53676 8.06945C0.869802 7.42947 1.23653 6.31256 2.15811 6.1795L5.88813 5.64259C6.25391 5.59012 6.57029 5.36336 6.73371 5.03635L8.40015 1.70528C8.81248 0.881647 10.0029 0.881647 10.4153 1.70528Z"
                            stroke="#C70039"
                            stroke-width="1.36865"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-xl font-bold">Easy</span>
                      <div className="relative">
                        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#CF4FA9] right-[260px] top-[50px]"></div>
                        <svg
                          className="absolute top-[-71px] left-[103px] "
                          width="122"
                          height="123"
                          viewBox="0 0 122 123"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M88.3297 1.7986C94.4585 -2.88961 103.212 2.16436 102.216 9.81616L97.583 45.3871L127.11 65.7418C133.471 70.1246 131.372 80.0041 123.777 81.4243L88.5251 88.0128L78.2854 122.379C76.0806 129.783 66.0385 130.837 62.3435 124.06L45.1832 92.5656L9.3284 93.4513C1.61143 93.6401 -2.49354 84.4107 2.81308 78.8048L27.4551 52.754L15.5351 18.931C12.9673 11.6432 20.474 4.88601 27.45 8.20324L59.8411 23.5968L88.3264 1.80433L88.3297 1.7986Z"
                            fill="#DF89C6"
                          />
                        </svg>
                        <div className="absolute top-[0] right-[130px] w-[96px] h-[96px] bg-amber-950  rounded-full ">
                          <Image
                            src="/images/girl.jpg"
                            alt="girl"
                            width={96}
                            height={96}
                            className="  w-[96px] h-[96px] rounded-full object-cover object-top grayscale"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Merry Section */}
        <section id="HowtoMerry" className=" m-auto py-20 bg-[#160404]">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-extrabold text-[#DF89C6] text-center mb-12">
              How to Merry
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-[#2A0B21] rounded-[40px] p-8 text-center">
                <div className="w-[120px] h-[120px] bg-[#411032] rounded-full mx-auto mb-10 flex justify-center items-center">
                  <Image
                    src="/images/image-556.png"
                    alt="Upload-emoji"
                    width={50}
                    height={50}
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Upload your cool picture
                </h3>
                <p className="text-[#C8CCDB]">
                  Lorem ipsum is a placeholder text
                </p>
              </div>
              <div className="bg-[#2A0B21] rounded-[40px] p-8 text-center">
                <div className="w-[120px] h-[120px] bg-[#411032] rounded-full mx-auto mb-10 flex justify-center items-center">
                  <Image
                    src="/images/image-556-1.png"
                    alt="Explore-emoji"
                    width={50}
                    height={50}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Explore and find the one you like
                </h3>
                <p className="text-[#C8CCDB]">
                  Lorem ipsum is a placeholder text
                </p>
              </div>
              <div className="bg-[#2A0B21] rounded-[40px] p-8 text-center">
                <div className="w-[120px] h-[120px] bg-[#411032] rounded-full mx-auto mb-10 flex justify-center items-center">
                  <Image
                    src="/images/image-556-2.png"
                    alt="Explore-emoji"
                    width={50}
                    height={50}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Click &apos;Merry&apos; for get to know!
                </h3>
                <p className="text-[#C8CCDB]">
                  Lorem ipsum is a placeholder text
                </p>
              </div>
              <div className="bg-[#2A0B21] rounded-[40px] p-8 text-center">
                <div className="w-[120px] h-[120px] bg-[#411032] rounded-full mx-auto mb-10 flex justify-center items-center">
                  <Image
                    src="/images/image-556-3.png"
                    alt="Explore-emoji"
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Start chating and relationship
                </h3>
                <p className="text-[#C8CCDB]">
                  Lorem ipsum is a placeholder text
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className=" py-0  md:py-20 bg-[#160404] ">
          <div className="container mx-auto px-6 ">
            <div className="md:rounded-[32px] overflow-hidden bg-gradient-to-r from-[#820025] to-[#A95BCD] h-[564px] md:h-[369px]  ">
              <div className="py-20 px-12   text-center relative">
                <div className="absolute top-[50px] left-[-20px] inset-0 bg-[url('/vector.png')] bg-cover opacity-20"></div>
                <h2 className="text-5xl font-extrabold text-white mb-12 relative z-10">
                  Let&apos;s start finding <br />
                  and matching someone new
                </h2>
                {isAuthenticated ? (
                  <Link
                    href="/matching"
                    className="bg-[#FFE1EA] text-[#950028] px-6 py-3 rounded-full font-bold hover:bg-[#FFB1C8] transition-colors relative z-10"
                  >
                    Start Matching!
                  </Link>
                ) : (
                  <Link
                    href="/matching"
                    className="bg-[#FFE1EA] text-[#950028] px-6 py-3 rounded-full font-bold hover:bg-[#FFB1C8] transition-colors relative z-10"
                  >
                    Start Matching!
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
