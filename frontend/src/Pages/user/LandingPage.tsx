import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../Components/User/Header'
import Footer from '../../Components/User/Footer'
import { Link } from 'react-router-dom'
import './css/LandingPage.css';

function LandingPage() {
    return (
        <>
            <Header />
            <div className="outerdiv bg-gray-100 pt-10 flex flex-col justify-center items-start">
                <div className="w-lg ms-5 px-2">
                    <h1 className='text-4xl title'>DISCOVER YOUR</h1>
                    <h1 className='text-4xl title'> DREAM <span className='text-blue-500'>JOB</span></h1>
                    <p>Great platform for the job seeker that searching for new career heights and <br /> passionate about startups.</p>
                    <div className="bg-white rounded-lg shadow-lg p-6 mt-5 mb-8">
                        <form className="flex flex-col sm:flex-row items-center">
                            <div className="flex-grow mb-4 sm:mb-0 sm:mr-2">
                                <input type="text" id="jobTitle" name="jobTitle" placeholder="job title" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="flex-grow mb-4 sm:mb-0 sm:ml-2">
                                <input type="text" id="location" name="location" placeholder="location" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ml-0 sm:ml-2">Search Jobs</button>
                        </form>
                    </div>
                    <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link></p>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default LandingPage
