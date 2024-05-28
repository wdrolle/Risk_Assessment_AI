return (
  <div>
    {(isLoading || isProcessing) && (
      <div className="z-10 fixed top-1/2 left-1/2 transform h-full w-full -translate-x-1/2 bg-opacity-80 bg-black text-2xl font-semibold -translate-y-1/2 flex items-center justify-center">
        <Loader2 className="h-[50px] w-[50px] text-white animate-spin mr-2" />
        <p className="text-[50px] text-white dark:text-zinc-400">{message}</p>
      </div>
    )}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col w-full p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Risk Category</TableHead>
                <TableHead>Low Risk</TableHead>
                <TableHead>Moderate Risk</TableHead>
                <TableHead>High Risk</TableHead>
                <TableHead>Inherent Risk Category</TableHead>
                <TableHead>Inherent Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(banksData as bank)?.codes?.map((content, index) => {
                const showMitigatingControls = form.watch(content.code);
                return (
                  <React.Fragment key={index}>
                    <TableRow className="border-b-2">
                      <TableCell className="align-top">
                        <FormField
                          control={form.control}
                          name={content.code as keyof typeof formSchema._type}
                          render={({ field }) => (
                            <FormItem className="m-2 text-sm flex items-center justify-center">
                              <FormControl>
                                <Checkbox
                                  id={`${content.code}`}
                                  className="mt-2"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="mt-4 mx-2 items-center flex justify-center">
                                {content.code}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        {content.riskCategory.substring(0, 40)}...
                      </TableCell>
                      <TableCell className="align-top">
                        {content.lowRisk.substring(0, 40)}...
                      </TableCell>
                      <TableCell className="align-top">
                        {content.moderateRisk.substring(0, 40)}...
                      </TableCell>
                      <TableCell className="align-top">
                        {content.highRisk.substring(0, 40)}...
                      </TableCell>
                      <TableCell className="align-top">
                        {
                          (banksData as bank)?.codeAnalyses.filter(
                            (assessment) => assessment.code === content.code
                          )[0]?.inherentRiskCategory
                        }
                      </TableCell>
                      <TableCell className="align-top">
                        {
                          (banksData as bank)?.codeAnalyses.filter(
                            (assessment) => assessment.code === content.code
                          )[0]?.inherentRiskScore
                        }
                      </TableCell>
                    </TableRow>
                    {showMitigatingControls && (
                      <>
                        <TableRow className="border-b-2">
                          <TableCell colSpan={7} className="text-center font-semibold">
                            Mitigating Controls
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-b-2">
                          <TableCell colSpan={1}></TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData as bank)?.codeAnalyses.filter(
                                (assessment) =>
                                  assessment.code === content.code
                              )[0]?.mitigatingControl
                            }
                          </TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData as bank)?.codeAnalyses.filter(
                                (assessment) =>
                                  assessment.code === content.code
                              )[0]?.mitigatingControlScore
                            }
                          </TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData as bank)?.codeAnalyses.filter(
                                (assessment) =>
                                  assessment.code === content.code
                              )[0]?.residualRiskScore
                            }
                          </TableCell>
                          <TableCell className="align-top">
                            {
                              (banksData as bank)?.codeAnalyses.filter(
                                (assessment) =>
                                  assessment.code === content.code
                              )[0]?.documentUsedForAnalysis
                            }
                          </TableCell>
                          <TableCell colSpan={2} className="align-top">
                            <Textarea
                              rows={6}
                              cols={6}
                              className="w-[300px]"
                              value={
                                (banksData as bank)?.codeAnalyses.filter(
                                  (assessment) =>
                                    assessment.code === content.code
                                )[0]?.comments
                              }
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                    <TableRow>
                      <TableCell colSpan={13}>
                        <Table className="h-full overflow-scroll">
                          <TableHeader>
                            <TableRow className="bg-black text-white">
                              <TableHead>#</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Strong(3)</TableHead>
                              <TableHead>Adequate(2)</TableHead>
                              <TableHead>Weak(1)</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Comments</TableHead>
                              <TableHead>Documents</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {content.subcode?.map((subcode, subIndex) => (
                              <TableRow key={subIndex}>
                                <TableCell className="align-top">
                                  {subcode.subcode}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.category}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.strong}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.adequate}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.weak}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.score}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.comments}
                                </TableCell>
                                <TableCell className="align-top">
                                  {subcode.documents}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col items-center">
          {(banksData as bank)?.codes?.length > 0 ? (
            <Button className="w-[100px] bg-blue-700 text-white hover:bg-blue-900 hover:text-white">
              Submit
            </Button>
          ) : (
            <div className="flex flex-col items-center justify-center gap-y-5 mt-3">
              <Button
                type="button"
                onClick={() => router.push("/codes/add-manage-codes")}
                className="flex w-[100px] bg-blue-700 text-white hover:bg-blue-900 hover:text-white"
              >
                Add codes
              </Button>
              <div className="flex">*Add Codes to start analysis</div>
            </div>
          )}
        </div>
      </form>
    </Form>
  </div>
);
