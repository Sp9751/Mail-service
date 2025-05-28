import CampaignModel from "../models/Campaigns.model";
import MailTrackModel from "../models/MailTracking.model";
import RabbitMQ from "../services/RabbitMQ";
import { redis } from "../services/Redis";
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import TempateModel from "../models/Template.model";
import { getCachedTemplate } from "../utils/getCachesTemplate";

export const queueConsumer = async () => {
  try {
    await RabbitMQ.consume(async (message) => {
      try {
        console.log(message);

        const { trackingId, to, userId, TemplateId } = message;

        const [mailTrack, campaign, templateDoc, userCaches] =
          await Promise.all([
            MailTrackModel.findOne({ campaignId: trackingId }),
            CampaignModel.findById(trackingId),
            TempateModel.findById(TemplateId),
            redis.get(userId),
          ]);

        if (!mailTrack || !campaign || !userCaches || !templateDoc) {
          console.log("No mail tracking found for this campaign");
          return;
        }

        const user = JSON.parse(userCaches);
        const smtp = user.domainSetup;

        if (!smtp?.username || !smtp?.password) {
          console.log("SMTP credentials not found");
          return;
        }

        const rawTemplate = await getCachedTemplate(
          TemplateId,
          templateDoc.templateUrl
        );

        const html = await ejs.render(rawTemplate, to);

        const transporter: Transporter = nodemailer.createTransport({
          host: smtp.host || "smtp.gmail.com",
          port: smtp.port || 465,
          service: smtp.service || "gmail",
          secure: smtp.secure || true, // true for 465, false for other ports
          auth: {
            user: "s96112516@gmail.com",
            pass: "bgjy cusb prrc npav",
          },
        });

        console.log("working");
        console.log(rawTemplate);
        console.log(html);

        if (typeof html !== "string") {
          console.log("Rendered template is not a string");
          return;
        }

        const MailOptions = {
          from: smtp.username || "",
          to: message.to.email,
          subject: campaign.subject,
          html: html,
        };

        await transporter.sendMail(MailOptions);

        await MailTrackModel.updateOne(
          { campaignId: trackingId },
          { $push: { success: to }, $inc: { "open.count": 0 } }
        );
      } catch (err) {
        console.error("❌ Error sending email:", err);
        await MailTrackModel.updateOne(
          { campaignId: message.trackingId },
          { $push: { failed: message.to } }
        );
      }
    });
  } catch (err: any) {
    console.error("error processing data: ", err.message);
  }
};
