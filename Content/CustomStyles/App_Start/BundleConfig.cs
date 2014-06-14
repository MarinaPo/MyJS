using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace FreeShop.SPA
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.validation.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/ajaxPrefilters.js",
                "~/Scripts/app/app.bindings.js",
                "~/Scripts/app/app.datamodel.js",
                "~/Scripts/app/app.viewmodel.js",
                "~/Scripts/app/home.viewmodel.js",
                "~/Scripts/app/login.viewmodel.js",
                "~/Scripts/app/register.viewmodel.js",
                "~/Scripts/app/registerExternal.viewmodel.js",
                "~/Scripts/app/manage.viewmodel.js",
                "~/Scripts/app/userInfo.viewmodel.js",
                "~/Scripts/app/_run.js",
                "~/Scripts/app/administration.viewmodel.js",
                "~/Scripts/app/ai.viewmodel.js",
                "~/Scripts/app/example.viewmodel.js",
                "~/Scripts/app/buying.viewmodel.js",
                "~/Scripts/app/orderlist.viewmodel.js",
                "~/Scripts/app/itemmanagement.viewmodel.js",
                "~/Scripts/app/number.viewmodel.js",
                "~/Scripts/app/listt.viewmodel.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                 "~/Content/bootstrap.css",
                 "~/Content/Site.css"));

            // Using custom styles
            bundles.Add(new StyleBundle("~/Content/CustomStyles").Include(
                "~/Content/CustomStyles/frame.css"));

            bundles.Add(new StyleBundle("~/Content/administration").Include(
                "~/Content/CustomStyles/administration.css"));

            bundles.Add(new StyleBundle("~/Content/buying").Include(
                "~/Content/CustomStyles/buying.css"));
        }
    }
}
