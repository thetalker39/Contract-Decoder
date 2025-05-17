
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeContract } from "@/ai/flows/summarize-contract";
import type { SummarizeContractOutput } from "@/ai/flows/summarize-contract";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultContractText = `WORK FOR HIRE
As of June 20, 2024
1. The undersigned, Roberto Cruz Rodriguez, Jr. p/k/a “Bobby Revenue” ( “You” or “Producer”),
904 N. Christine Drive, Midwest City, OK 73130, has been engaged by M. Noble Estate Enterprises, LLC
(“Company”) c/o Ward White PLLC, 114 ½ E. Louisana Street, Ste. 206, McKinney, Texas 75069, to
provide musician, production, programming and/or vocal services (“Performances”) in connection with
certain materials including, without limitation, one (1) master recording (the “Master”) of the musical
composition currently entitled “3AM” (the “Composition”), which embodies the featured performance of
the artist Melvin Noble professionally known as “Mo3” (“Artist”). The Master is intended to be embodied
on Artist’s forthcoming release subject to Company’s distribution agreement with a distributor
(“Distributor”) to be determed by Company (the “Distribution Agreement”). As used herein, “you” shall
mean Producer and any Personnel (as defined below). As used herein, the term “Company’s designee”
shall include, but not be limited to, any record label and/or distributor that Company and/or Artist may
enter into a distribution agreement.
2. For the sum of Two Hundred Fifty Dollars ($250.00) (the “Fee”), and other good and valuable
consideration, the receipt and sufficiency of which is hereby acknowledged, for any and all services
rendered, including but not limited to, the Performances on and in connection with the Master, together
with all other information and items, including all necessary licenses and applicable approvals and
consents, upon the terms hereinafter stated: you hereby grant Company and/or Company’s designee the
right, but not the obligation, to include the Performances on records as well as any and all other uses of the
Master and Performances and to exploit the Master and Performances in any manner whatsoever without
further payment to you and/or any third parties engaged and/or furnished by you (“Personnel”), except as
provided herein.
3. The provisions of any applicable collective bargaining contract between Company, Artist and/or
Company’s designees and any labor organization which are required by the terms of such contract to be
included in this work for hire shall be deemed incorporated herein. You agree that to the extent the
services to be rendered by you hereunder are subject to the provisions of any collective bargaining
agreement between Company, Artist and/or Company’s designees and any guild, union or labor
organization having jurisdiction, the Fee shall be deemed to include compensation for such services in the
minimum amount specified for such services in the applicable collective bargaining agreements (including
any residual or new use payments specified in such agreements).
4. You hereby certify and agree that the Master and all versions thereof, as well as the results and
proceeds of all services to be rendered or which have been rendered by you in connection with the Master,
including without limitation, the Performances and “outtakes” thereof shall, from the inception of creation
be deemed a “work made for hire” for Company and/or Company’s designee (as defined under the United
States Copyright Act and any other applicable law). If, for any reason, said Performances and/or the
Master and/or any portions thereof, shall be adjudged not to be a “work made for hire,” then you hereby
irrevocably assign all rights of ownership in and to the Performances and Master, including without
limitation, all copyrights and all renewals and extensions thereof throughout the universe, to Company
and/or Company’s designee, and such rights shall be deemed transferred to Company and/or Company’s
designee by this agreement. The Performances and Master, and such results and proceeds thereof shall,
from the inception of their creation, be entirely the property of Company in perpetuity, throughout the
Universe, free of any claim whatsoever by you or by any persons deriving any rights or interests therefrom.
5. Both parties hereby agree and acknowledge that with respect to the Master entitled “3AM”, fifteen
percent (15%) of the Composition embodied on such Master hereunder is wholly or partly written by or
directly or indirectly owned or controlled by you (the “Controlled Composition”). You hereby license in
perpetuity (or shall cause your music publishing designee(s) to license) such Controlled Composition to
Company and/or Company’s designee on the same basis as contained in the Distribution Agreement,
including, without limitation, with respect to reduced royalty rates, reserves, so-called “caps” and other
uses. Without limiting the generality of the foregoing, you hereby issue, and agree to cause your music
publishing designee(s) to issue, to Company and Company’s designees, a first use mechanical license for
Bobby Revenue
Legend – 3AM
1
Doc ID: 78ece168b38af0aa1d9b95fe8e580d59cba67edf
each Controlled Composition (or portions thereof) pursuant to the terms hereinabove. Further, you hereby
grant Company and Company’s designee a royalty-free license to reproduce the Controlled Composition
for promotional-only purposes (i.e., purposes for which Artist and/or any co-writer do not receive payment
therefrom), including, without limitation in synchronization with and in timed relation to visual images
featuring Artist’s performances in so-called promotional “video programs.” For the avoidance of doubt,
each applicable writer / publisher shall exclusively administer his/her/its respective share of the
Composition.
6. You hereby grant to Company, Artist and/or Company’s designee the right to use your name,
approved likeness and approved biographical material (the “ID Materials”) concerning you solely in
connection with the sale, advertising and promotion of all records derived from, and exploitations of, the
Master(s) and the Album. You shall be afforded credit in substantially the following form: “Produced by
Bobby Revenue.” No inadvertent, non-repetitive failure to apply with this subparagraph will constitute a
breach of this agreement.
7. You hereby represent and warrant that: (i) You are under no disability, restriction or prohibition,
whether contractual or otherwise, with respect to your right to execute this agreement and to fully perform
its terms and conditions; (ii) Neither Company, Artist nor Company’s designee shall be required to make
any payment of any nature for, or in connection with, the rendition of your services or the acquisition,
exercise or exploitation of rights pursuant to this agreement, except as specifically provided herein; (iii) To
the extent of your contribution thereto, there shall be no liens, encumbrances or other charges against the
Master at the time of delivery, including, without limitation, any uncleared samples; (iv) All materials
furnished by you in connection with the Master shall be original and shall not infringe upon or violate the
rights of any third parties; (v) You will not render services for any person or entity other than Company
and/or Artist a master recording embodying any of your Performances embodied in the Master for at least
three (3) years from the date of delivery of the Master to Company. You agree that in the event of any
dispute regarding the subject matter hereof, you will not have the right to seek injunctive relief or rescission
in connection with the Master, the results and proceeds of your services hereunder and/or any exploitation,
promotion, advertising and/or publicity thereof.
8. You agree to and do hereby indemnify and hold harmless Company, Artist and/or Company’s
designee, and their respective successors, assigns, agents, distributors and licensees, officers, directors,
representatives and employees from and against any claims, losses, liabilities, damages, costs or expenses
(including reasonable outside attorneys’ fees and actual legal expenses) in connection with any third-party
claim occasioned by or arising out of any breach or alleged breach by you of any agreement, representation,
grant or warranty made or assumed by you hereunder provided such claim is reduced to final adverse
judgment in a court of competent jurisdiction or settled with your prior written consent, not to be
unreasonably withheld. You will reimburse Company, Artist and/or Company’s designee upon demand for
any payment made by Company, Artist and/or Company’s designee at any time after the date hereof in
respect of any claim, liability, damage or expense to which the foregoing indemnity relates.
9. (a) It is understood and agreed that you shall notify Company in writing, as soon as possible,
of all portion(s) of any and all copyrighted selections and/or copyrighted sound recordings (including,
without limitation, any sounds accompanying copyrighted audiovisual works) owned or controlled by third
parties which you and/or anyone engaged by and/or furnished by you, propose to be embodied on or
interpolated in the Master (“Embodied Copyrighted Material(s)”), including all parties controlling rights in
and to such Embodied Copyrighted Material. Provided that you promptly and accurately notify Company
as aforesaid, Company shall, with respect to each such Embodied Copyrighted Material that Company
approves for embodiment on the Master, assist in arranging for the authorization and licensing to Artist,
Company and/or Company’s designees of all necessary rights in connection with the embodiment of such
Embodied Copyrighted Material on the Master (the “Clearance Efforts”). In the event that (i) Company is
unable to obtain clearance for any Embodied Copyrighted Material(s) on terms reasonably acceptable to
Company or (ii) Company, in Company’s sole discretion, elects to cause you to remove any such
Embodied Copyrighted Material(s) from the Master, then upon notice to you thereof, you shall remove
such Embodied Copyrighted Material(s) promptly, at your sole cost and expense and for no additional
compensation, and the Master shall not be deemed delivered or accepted hereunder unless and until you
Bobby Revenue
Legend – 3AM
2
Doc ID: 78ece168b38af0aa1d9b95fe8e580d59cba67edf
have complied with the terms of this sentence, in addition to the other requirements under this agreement.
You shall be responsible for sample clearance fees and/or advances and/or royalties and/or other continuing
obligations to third parties that may be incurred in connection with Embodied Copyrighted Material(s)
hereunder, and such amounts shall be fully deductible from any amounts payable to you hereunder. In the
event that an ownership or financial interest in the Composition is granted to a third party in connection
with Embodied Copyrighted Material(s), you will indemnify Company and Artist and promptly reimburse
Company and/or Artist for any consequent loss, damage or reduction in income suffered by Company
and/or Artist from all monies payable to you hereunder or reimbursable by you.
(b) Subject to the provisions hereof and unless otherwise agreed in writing by the parties
hereto, you shall pay and be responsible for the clearance of any Embodied Copyrighted Material(s) (or
removal of any uncleared Embodied Copyrighted Material(s)) not approved as provided herein or not
disclosed to Company (“Undisclosed Embodied Copyrighted Material(s)”). In the event Company, Artist
and/or Company’s designees makes any payments to secure any license in connection with any
Undisclosed Embodied Copyrighted Material(s), then without limiting any other rights or remedies that
Company, Artist and/or Company’s designees may have, you shall reimburse Company, Artist and/or
Company’s designees for all costs incurred by Company, Artist and/or Company’s designees in connection
with any Undisclosed Embodied Copyrighted Material(s) (including the costs incurred in connection with
re-recording, re-mixing, or otherwise re-editing the Master hereunder as a result of having to delete any
Undisclosed Embodied Copyrighted Material(s) embodied thereon), and Company, Artist and/or
Company’s designees shall be entitled to deduct from your share of any reimbursable costs not promptly
reimbursed by you from any monies payable to you hereunder. To the extent that any Undisclosed
Embodied Copyrighted Material(s) result in the conveyance of a copyright interest in the Composition, you
will indemnify Company and Artist and promptly reimburse Company and/or Artist for any consequent
loss, damage or reduction in income suffered by Company and/or Artist from all monies payable to you
hereunder or reimbursable by you.
10. This agreement contains the entire understanding of the parties relating to its subject matter and
cannot be canceled, modified, amended or waived, in part or in full, in any way except by an instrument in
writing signed by the party to be charged. No waiver, whether express or implied, of any provision of this
agreement or any default hereunder shall affect a party’s right to thereafter enforce such provision or to
exercise any right or remedy in the event of any other default, whether or not similar. All remedies, rights,
undertakings, and obligations contained in this agreement shall be cumulative and none of them shall be in
limitation of any other remedy, right, undertaking, or obligation of any party. This agreement shall be
governed by and construed under the laws and judicial decisions of the State of Georgia. All claims,
disputes or disagreements which may arise out of the interpretation, performance or breach of this
agreement shall be submitted exclusively to the jurisdiction of the state courts of the State of Georgia
located in Fulton County or the Federal District courts located in Fulton County; provided, however, if
either party is sued or joined in any other court or forum in respect of any matter which may give rise to a
claim by Company hereunder, you shall consent to the jurisdiction of such court or from over any such
claim which may be asserted hereunder. Should any paragraph or provision of this agreement be held to be
void, invalid or inoperative, such decision shall not affect any other paragraph or provision hereof, and the
remainder of this agreement shall be effective as though such void, invalid or inoperative paragraph or
provision had not been contained herein. Nothing contained in this agreement shall be deemed to constitute
a partnership or joint venture between you, on one hand, and Company on the other. You shall have the
status of an independent contractor hereunder, and nothing herein shall constitute or contemplate you as the
agent or employee of Company. This agreement may be executed by facsimile or PDF.
11. YOU HEREBY ACKNOWLEDGE THAT YOU HAVE BEEN ADVISED BY COMPANY
TO SEEK AND RECEIVE LEGAL ADVICE FROM INDEPENDENT COUNSEL WITH
RESPECT TO THE TERMS AND PROVISIONS CONTAINED IN THIS AGREEMENT. YOU
HAVE EITHER CONSULTED WITH SUCH ATTORNEY OR HAVE WAIVED SUCH RIGHT
AND HAVE DECIDED TO ENTER INTO THIS AGREEMENT FREELY, WITHOUT ANY
COERCION OR DURESS FROM ANY PERSON.
Bobby Revenue
Legend – 3AM
3
Doc ID: 78ece168b38af0aa1d9b95fe8e580d59cba67edf
IN WITNESS WHEREOF, the undersigned has duly executed this Work For Hire on the day and year first
written above.
AGREED & ACKNOWLEDGED BY: AGREED & ACKNOWLEDGED BY:
M. Noble Estate Enterprises, LLC Bobby Revenue
_________________________ ___________________________
Roberto Cruz Rodriguez, Jr.
Daniel L. White An Authorized Signatory
Bobby Revenue
Legend – 3AM
4
Doc ID: 78ece168b38af0aa1d9b95fe8e580d59cba67edf
INDUCEMENT
To induce M. Noble Estate Enterprises, LLC (“Company”) to enter into the foregoing agreement
(“Agreement”) with Roberto Cruz Rodriguez, Jr. p/k/a Bobby Revenue (“Producer”), the undersigned
hereby:
(a) conditions of the Agreement;
acknowledges that the undersigned understands and is familiar with all the terms and
(b) assents to the execution of the Agreement and agrees to be bound by the terms and
conditions thereof, including, without limitation, each and every provision of the Agreement that relates to
the undersigned in any way, directly or indirectly, the services to be rendered thereunder by the
undersigned and restrictions imposed upon the undersigned in accordance with the provisions of the
Agreement, and hereby guarantees to Company the full and faithful performance of all the terms and
conditions of the Agreement by the undersigned and Producer (including, without limitation, all
representations, warranties and indemnification obligations set forth in the Agreement); and
(c) acknowledges and agrees that Company shall be under no obligation to make any
payments to the undersigned or otherwise, for or in connection with this inducement and for or in
connection with the services rendered by the undersigned or in connection with the rights granted to
Company thereunder and the fulfillment of the undersigned’s obligations pursuant to the Agreement
(except mechanical royalties and other publishing monies, if any).
AGREED AND ACCEPTED:
Bobby Revenue
__________________________________________
Roberto Cruz Rodriguez, Jr.
Bobby Revenue
Legend – 3AM
5
Doc ID: 78ece168b38af0aa1d9b95fe8e580d59cba67edf
06 / 20 / 2024
16:05:36 UTC
06 / 28 / 2024
04:31:14 UTC
06 / 28 / 2024
04:36:30 UTC
06 / 28 / 2024
16:13:53 UTC
Work For Hire Agreement | 3AM | Mo3 | Co-Producer with Rob...
06202024_Roberto_Rodriquez_3AM_WFH.pdf
78ece168b38af0aa1d9b95fe8e580d59cba67edf
MM / DD / YYYY
Signed
Sent for signature to Roberto Cruz Rodriguez, Jr.
(bobbyrevenue@gmail.com) and Daniel L. White
(dwhite@wardwhitepllc.com) from
reshaun.finkley@townsendlockett.com
IP: 198.61.58.3
Viewed by Roberto Cruz Rodriguez, Jr.
(bobbyrevenue@gmail.com)
IP: 172.5.75.181
Signed by Roberto Cruz Rodriguez, Jr.
(bobbyrevenue@gmail.com)
IP: 172.5.75.181
Viewed by Daniel L. White (dwhite@wardwhitepllc.com)
IP: 76.184.195.6
09 / 09 / 2024
16:42:48 UTC
09 / 09 / 2024
16:42:48 UTC
Work For Hire Agreement | 3AM | Mo3 | Co-Producer with Rob...
06202024_Roberto_Rodriquez_3AM_WFH.pdf
78ece168b38af0aa1d9b95fe8e580d59cba67edf
MM / DD / YYYY
Signed
Signed by Daniel L. White (dwhite@wardwhitepllc.com)
IP: 76.184.195.6
The document has been completed.`;

export default function SmartScanPage() {
  const [contractText, setContractText] = useState<string>(defaultContractText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SummarizeContractOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contractText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste your contract text.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await summarizeContract({ contractText });
      setResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error Scanning Contract",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Smart Contract Scan</h1>
        <p className="text-muted-foreground">
          Upload or paste your contract to extract key terms, summarize clauses, and identify unusual provisions.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enter Contract Text</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              placeholder="Paste your contract text here..."
              value={contractText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContractText(e.target.value)}
              rows={15}
              className="border-border focus:ring-ring"
              disabled={isLoading}
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Scan Contract
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>Key terms, clause summaries, and unusual provisions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Summary:</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-md text-foreground whitespace-pre-wrap">
              {result.summary}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
